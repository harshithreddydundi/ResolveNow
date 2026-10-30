package com.resolvenow.complaint.service;

import com.resolvenow.complaint.client.AssignmentClient;
import com.resolvenow.complaint.client.NotificationClient;
import com.resolvenow.complaint.dto.*;
import com.resolvenow.complaint.entity.*;
import com.resolvenow.complaint.exception.BadRequestException;
import com.resolvenow.complaint.exception.ResourceNotFoundException;
import com.resolvenow.complaint.repository.ComplaintActivityRepository;
import com.resolvenow.complaint.repository.ComplaintRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ComplaintService {

    private static final Logger log = LoggerFactory.getLogger(ComplaintService.class);

    private final ComplaintRepository complaintRepository;
    private final ComplaintActivityRepository activityRepository;
    private final SseEmitterService sseEmitterService;
    private final NotificationClient notificationClient;
    private final AssignmentClient assignmentClient;

    public ComplaintService(
            ComplaintRepository complaintRepository,
            ComplaintActivityRepository activityRepository,
            SseEmitterService sseEmitterService,
            NotificationClient notificationClient,
            AssignmentClient assignmentClient) {
        this.complaintRepository = complaintRepository;
        this.activityRepository = activityRepository;
        this.sseEmitterService = sseEmitterService;
        this.notificationClient = notificationClient;
        this.assignmentClient = assignmentClient;
    }

    @Transactional
    public ComplaintDto createComplaint(CreateComplaintRequest req) {
        String ticketNum = generateTicketNumber();

        String department = req.getDepartment();
        if (department == null || department.isBlank()) {
            department = resolveDefaultDepartment(req.getCategory());
        }

        Complaint complaint = new Complaint(
                ticketNum,
                req.getTitle(),
                req.getDescription(),
                req.getCategory(),
                req.getPriority(),
                req.getCustomerId() != null ? req.getCustomerId() : 1L,
                req.getCustomerName() != null ? req.getCustomerName() : "Valued Customer",
                req.getCustomerEmail(),
                department
        );

        computeEstimatedResolution(complaint);

        Complaint saved = complaintRepository.save(complaint);

        // Record activity log
        String etaMsg = saved.getEstimatedResolutionText() != null ? " Target resolution: " + saved.getEstimatedResolutionText() + "." : "";
        logActivity(saved.getId(), "CREATED", "Ticket logged and registered in ResolveNow." + etaMsg,
                req.getCustomerName() != null ? req.getCustomerName() : "Customer");

        // Dispatch inter-service calls
        assignmentClient.triggerAssignment(saved.getId(), department, saved.getPriority().name());
        notificationClient.sendNotification(
                saved.getCustomerId(),
                saved.getId(),
                "TICKET_CREATED",
                "Ticket Created: " + saved.getTicketNumber(),
                "Your issue '" + saved.getTitle() + "' has been logged and assigned to " + department + "." + etaMsg
        );

        ComplaintDto dto = ComplaintDto.fromEntity(saved);
        sseEmitterService.broadcast("TICKET_CREATED", dto);
        log.info("Created new complaint: {} with ID {}", saved.getTicketNumber(), saved.getId());
        return dto;
    }

    public Page<ComplaintDto> getComplaints(String search, Status status, Priority priority,
                                            String department, Long customerId, Long agentId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        boolean hasFilter = (search != null && !search.isBlank())
                || status != null
                || priority != null
                || (department != null && !department.isBlank())
                || customerId != null
                || agentId != null;

        if (!hasFilter) {
            return complaintRepository.findAll(pageable).map(ComplaintDto::fromEntity);
        }

        String searchParam = (search != null && !search.isBlank()) ? search.trim() : null;
        String deptParam = (department != null && !department.isBlank()) ? department.trim() : null;

        return complaintRepository.searchComplaints(searchParam, status, priority, deptParam, customerId, agentId, pageable)
                .map(ComplaintDto::fromEntity);
    }

    public ComplaintDto getComplaintById(Long id) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with id: " + id));
        return ComplaintDto.fromEntity(complaint);
    }

    public ComplaintDto getComplaintByTicketNumber(String ticketNumber) {
        Complaint complaint = complaintRepository.findByTicketNumber(ticketNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with ticket number: " + ticketNumber));
        return ComplaintDto.fromEntity(complaint);
    }

    public List<ComplaintDto> getComplaintsByCustomerId(Long customerId) {
        return complaintRepository.findByCustomerIdOrderByCreatedAtDesc(customerId).stream()
                .map(ComplaintDto::fromEntity)
                .collect(Collectors.toList());
    }

    public List<ComplaintDto> getComplaintsByAgentId(Long agentId) {
        return complaintRepository.findByAssignedAgentIdOrderByCreatedAtDesc(agentId).stream()
                .map(ComplaintDto::fromEntity)
                .collect(Collectors.toList());
    }

    public List<ComplaintDto> getComplaintsByStatus(Status status) {
        return complaintRepository.findByStatusOrderByCreatedAtDesc(status).stream()
                .map(ComplaintDto::fromEntity)
                .collect(Collectors.toList());
    }

    public List<ComplaintDto> getComplaintsByDepartment(String department) {
        return complaintRepository.findByDepartmentOrderByCreatedAtDesc(department).stream()
                .map(ComplaintDto::fromEntity)
                .collect(Collectors.toList());
    }

    public List<ComplaintDto> getComplaintsByPriority(Priority priority) {
        return complaintRepository.findByPriorityOrderByCreatedAtDesc(priority).stream()
                .map(ComplaintDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public ComplaintDto updateComplaint(Long id, UpdateComplaintRequest req) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with id: " + id));

        if (req.getTitle() != null) complaint.setTitle(req.getTitle());
        if (req.getDescription() != null) complaint.setDescription(req.getDescription());
        if (req.getCategory() != null) complaint.setCategory(req.getCategory());
        if (req.getPriority() != null) complaint.setPriority(req.getPriority());
        if (req.getDepartment() != null) complaint.setDepartment(req.getDepartment());

        Complaint updated = complaintRepository.save(complaint);
        logActivity(id, "UPDATED", "Complaint details updated", "System");
        ComplaintDto dto = ComplaintDto.fromEntity(updated);
        sseEmitterService.broadcast("TICKET_UPDATED", dto);
        return dto;
    }

    @Transactional
    public void deleteComplaint(Long id) {
        if (!complaintRepository.existsById(id)) {
            throw new ResourceNotFoundException("Complaint not found with id: " + id);
        }
        activityRepository.deleteByComplaintId(id);
        complaintRepository.deleteById(id);
    }

    @Transactional
    public ComplaintDto updateStatus(Long id, UpdateStatusRequest req) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with id: " + id));

        validateTransition(complaint.getStatus(), req.getStatus());

        Status oldStatus = complaint.getStatus();
        complaint.setStatus(req.getStatus());

        if (req.getStatus() == Status.RESOLVED) {
            complaint.setResolvedAt(LocalDateTime.now());
            if (req.getRemarks() != null && !req.getRemarks().isBlank()) {
                complaint.setResolutionNotes(req.getRemarks());
                complaint.setResolvedBy(req.getUpdatedBy() != null ? req.getUpdatedBy() : "Staff");
            }
        } else if (req.getStatus() == Status.CLOSED) {
            complaint.setClosedAt(LocalDateTime.now());
        }

        if (req.getEstimatedResolutionText() != null && !req.getEstimatedResolutionText().isBlank()) {
            complaint.setEstimatedResolutionText(req.getEstimatedResolutionText());
        }
        if (req.getEstimatedResolutionAt() != null) {
            complaint.setEstimatedResolutionAt(req.getEstimatedResolutionAt());
        } else if (complaint.getEstimatedResolutionText() == null) {
            computeEstimatedResolution(complaint);
        }

        Complaint updated = complaintRepository.save(complaint);
        String remarkStr = req.getRemarks() != null ? " (" + req.getRemarks() + ")" : "";
        String etaNote = "";
        if (req.getStatus() == Status.IN_PROGRESS && updated.getEstimatedResolutionText() != null) {
            etaNote = " [Target Resolution: " + updated.getEstimatedResolutionText() + "]";
        }
        logActivity(id, "STATUS_CHANGED", "Status changed from " + oldStatus + " to " + req.getStatus() + etaNote + remarkStr,
                req.getUpdatedBy() != null ? req.getUpdatedBy() : "Staff");

        // Notify customer
        notificationClient.sendNotification(
                complaint.getCustomerId(),
                complaint.getId(),
                "TICKET_STATUS_CHANGED",
                "Status Updated: " + complaint.getTicketNumber(),
                "Ticket status updated to " + req.getStatus() + etaNote + remarkStr
        );

        ComplaintDto dto = ComplaintDto.fromEntity(updated);
        sseEmitterService.broadcast("TICKET_STATUS_CHANGED", dto);
        return dto;
    }

    @Transactional
    public ComplaintDto updatePriority(Long id, UpdatePriorityRequest req) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with id: " + id));

        Priority oldPriority = complaint.getPriority();
        complaint.setPriority(req.getPriority());

        Complaint updated = complaintRepository.save(complaint);
        String remarkStr = req.getRemarks() != null ? " (" + req.getRemarks() + ")" : "";
        logActivity(id, "PRIORITY_CHANGED", "Priority adjusted from " + oldPriority + " to " + req.getPriority() + remarkStr,
                req.getUpdatedBy() != null ? req.getUpdatedBy() : "Staff");

        ComplaintDto dto = ComplaintDto.fromEntity(updated);
        sseEmitterService.broadcast("TICKET_PRIORITY_CHANGED", dto);
        return dto;
    }

    @Transactional
    public ComplaintDto assignTicket(Long id, AssignTicketRequest req) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with id: " + id));

        complaint.setDepartment(req.getDepartment());
        if (req.getAgentId() != null) {
            complaint.setAssignedAgentId(req.getAgentId());
            complaint.setAssignedAgentName(req.getAgentName());
        }
        if (complaint.getStatus() == Status.OPEN) {
            complaint.setStatus(Status.ASSIGNED);
        }

        Complaint updated = complaintRepository.save(complaint);
        String agentMsg = req.getAgentName() != null ? " and assigned to agent " + req.getAgentName() : "";
        logActivity(id, "ASSIGNED", "Ticket routed to " + req.getDepartment() + agentMsg,
                req.getAssignedBy() != null ? req.getAssignedBy() : "Manager");

        notificationClient.sendNotification(
                complaint.getCustomerId(),
                complaint.getId(),
                "TICKET_ASSIGNED",
                "Ticket Assigned: " + complaint.getTicketNumber(),
                "Your ticket has been assigned to " + req.getDepartment() + agentMsg
        );

        if (req.getAgentId() != null) {
            notificationClient.sendNotification(
                    req.getAgentId(),
                    complaint.getId(),
                    "TICKET_ASSIGNED",
                    "New Ticket Assignment: " + complaint.getTicketNumber(),
                    "You have been assigned ticket '" + complaint.getTitle() + "'"
            );
        }

        ComplaintDto dto = ComplaintDto.fromEntity(updated);
        sseEmitterService.broadcast("TICKET_ASSIGNED", dto);
        return dto;
    }

    @Transactional
    public ComplaintDto escalateTicket(Long id, EscalateTicketRequest req) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with id: " + id));

        complaint.setStatus(Status.ESCALATED);
        complaint.setPriority(Priority.CRITICAL);
        if (req.getTargetDepartment() != null && !req.getTargetDepartment().isBlank()) {
            complaint.setDepartment(req.getTargetDepartment());
        }

        Complaint updated = complaintRepository.save(complaint);
        logActivity(id, "ESCALATED", "Ticket escalated to CRITICAL. Reason: " + req.getReason(),
                req.getEscalatedBy() != null ? req.getEscalatedBy() : "Manager");

        notificationClient.sendNotification(
                complaint.getCustomerId(),
                complaint.getId(),
                "TICKET_ESCALATED",
                "Ticket Escalated: " + complaint.getTicketNumber(),
                "Your ticket has been escalated for expedited resolution: " + req.getReason()
        );

        ComplaintDto dto = ComplaintDto.fromEntity(updated);
        sseEmitterService.broadcast("TICKET_ESCALATED", dto);
        return dto;
    }

    @Transactional
    public ComplaintDto resolveTicket(Long id, String resolvedBy, String remarks) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with id: " + id));

        validateTransition(complaint.getStatus(), Status.RESOLVED);

        complaint.setStatus(Status.RESOLVED);
        complaint.setResolvedAt(LocalDateTime.now());
        complaint.setResolutionNotes(remarks);
        complaint.setResolvedBy(resolvedBy != null ? resolvedBy : "Agent");

        Complaint updated = complaintRepository.save(complaint);
        String remarkMsg = (remarks != null && !remarks.isBlank()) ? " Resolution notes: " + remarks : "";
        logActivity(id, "RESOLVED", "Ticket marked as resolved." + remarkMsg,
                resolvedBy != null ? resolvedBy : "Agent");

        notificationClient.sendNotification(
                complaint.getCustomerId(),
                complaint.getId(),
                "TICKET_RESOLVED",
                "Ticket Resolved: " + complaint.getTicketNumber(),
                "Your issue has been resolved." + remarkMsg
        );

        ComplaintDto dto = ComplaintDto.fromEntity(updated);
        sseEmitterService.broadcast("TICKET_RESOLVED", dto);
        return dto;
    }

    @Transactional
    public ComplaintDto closeTicket(Long id, String closedBy, String remarks) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with id: " + id));

        validateTransition(complaint.getStatus(), Status.CLOSED);

        complaint.setStatus(Status.CLOSED);
        complaint.setClosedAt(LocalDateTime.now());

        Complaint updated = complaintRepository.save(complaint);
        logActivity(id, "CLOSED", "Ticket officially closed.",
                closedBy != null ? closedBy : "Customer");

        notificationClient.sendNotification(
                complaint.getCustomerId(),
                complaint.getId(),
                "TICKET_CLOSED",
                "Ticket Closed: " + complaint.getTicketNumber(),
                "Your ticket is now closed. Thank you for using ResolveNow."
        );

        ComplaintDto dto = ComplaintDto.fromEntity(updated);
        sseEmitterService.broadcast("TICKET_CLOSED", dto);
        return dto;
    }

    @Transactional
    public ComplaintDto reopenTicket(Long id, String reopenedBy, String reason) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with id: " + id));

        validateTransition(complaint.getStatus(), Status.REOPENED);

        complaint.setStatus(Status.REOPENED);
        complaint.setResolvedAt(null);
        complaint.setClosedAt(null);

        Complaint updated = complaintRepository.save(complaint);
        String reasonMsg = (reason != null && !reason.isBlank()) ? ": " + reason : "";
        logActivity(id, "REOPENED", "Customer reopened the ticket" + reasonMsg,
                reopenedBy != null ? reopenedBy : "Customer");

        if (complaint.getAssignedAgentId() != null) {
            notificationClient.sendNotification(
                    complaint.getAssignedAgentId(),
                    complaint.getId(),
                    "TICKET_REOPENED",
                    "Ticket Reopened: " + complaint.getTicketNumber(),
                    "Customer reopened ticket '" + complaint.getTitle() + "'" + reasonMsg
            );
        }

        ComplaintDto dto = ComplaintDto.fromEntity(updated);
        sseEmitterService.broadcast("TICKET_REOPENED", dto);
        return dto;
    }

    public List<ComplaintActivityDto> getActivities(Long complaintId) {
        return activityRepository.findByComplaintIdOrderByTimestampDesc(complaintId).stream()
                .map(ComplaintActivityDto::fromEntity)
                .collect(Collectors.toList());
    }

    public AnalyticsSummaryDto getAnalyticsSummary() {
        AnalyticsSummaryDto summary = new AnalyticsSummaryDto();
        summary.setTotalTickets(complaintRepository.count());
        summary.setOpenTickets(complaintRepository.countByStatus(Status.OPEN));
        summary.setInProgressTickets(complaintRepository.countByStatus(Status.IN_PROGRESS) + complaintRepository.countByStatus(Status.ASSIGNED));
        summary.setResolvedTickets(complaintRepository.countByStatus(Status.RESOLVED));
        summary.setClosedTickets(complaintRepository.countByStatus(Status.CLOSED));
        summary.setEscalatedTickets(complaintRepository.countByStatus(Status.ESCALATED));
        summary.setCriticalTickets(complaintRepository.countByPriority(Priority.CRITICAL));

        // Calculate average resolution time
        List<Complaint> resolved = complaintRepository.findByStatusOrderByCreatedAtDesc(Status.RESOLVED);
        if (!resolved.isEmpty()) {
            double totalHours = 0;
            int count = 0;
            for (Complaint c : resolved) {
                if (c.getResolvedAt() != null && c.getCreatedAt() != null) {
                    totalHours += Duration.between(c.getCreatedAt(), c.getResolvedAt()).toMinutes() / 60.0;
                    count++;
                }
            }
            summary.setAvgResolutionTimeHours(count > 0 ? Math.round((totalHours / count) * 10.0) / 10.0 : 4.2);
        } else {
            summary.setAvgResolutionTimeHours(3.5);
        }

        // Group counts
        summary.setByStatus(mapGroupCounts(complaintRepository.countGroupByStatus()));
        summary.setByPriority(mapGroupCounts(complaintRepository.countGroupByPriority()));
        summary.setByDepartment(mapGroupCounts(complaintRepository.countGroupByDepartment()));
        summary.setByCategory(mapGroupCounts(complaintRepository.countGroupByCategory()));

        return summary;
    }

    private Map<String, Long> mapGroupCounts(List<Object[]> rows) {
        Map<String, Long> map = new LinkedHashMap<>();
        for (Object[] row : rows) {
            if (row[0] != null) {
                map.put(row[0].toString(), ((Number) row[1]).longValue());
            }
        }
        return map;
    }

    private void validateTransition(Status current, Status next) {
        if (current == next) return;

        boolean allowed = switch (current) {
            case OPEN -> next == Status.ASSIGNED || next == Status.IN_PROGRESS || next == Status.ESCALATED;
            case ASSIGNED -> next == Status.IN_PROGRESS || next == Status.WAITING_FOR_CUSTOMER || next == Status.ESCALATED || next == Status.RESOLVED;
            case IN_PROGRESS -> next == Status.WAITING_FOR_CUSTOMER || next == Status.ESCALATED || next == Status.RESOLVED || next == Status.CLOSED;
            case WAITING_FOR_CUSTOMER -> next == Status.IN_PROGRESS || next == Status.RESOLVED || next == Status.CLOSED;
            case ESCALATED -> next == Status.IN_PROGRESS || next == Status.ASSIGNED || next == Status.RESOLVED;
            case RESOLVED -> next == Status.CLOSED || next == Status.REOPENED;
            case REOPENED -> next == Status.IN_PROGRESS || next == Status.ASSIGNED || next == Status.RESOLVED;
            case CLOSED -> false; // Closed tickets cannot transition
        };

        if (!allowed) {
            throw new BadRequestException("Invalid lifecycle transition from " + current + " to " + next);
        }
    }

    public void computeEstimatedResolution(Complaint complaint) {
        LocalDateTime created = complaint.getCreatedAt() != null ? complaint.getCreatedAt() : LocalDateTime.now();
        Priority priority = complaint.getPriority() != null ? complaint.getPriority() : Priority.MEDIUM;

        if (priority == Priority.CRITICAL || priority == Priority.HIGH) {
            // High / Critical target: within 4-8 hours
            if (created.getHour() < 18) {
                LocalDateTime tonight = created.toLocalDate().atTime(21, 0);
                complaint.setEstimatedResolutionAt(tonight);
                complaint.setEstimatedResolutionText("Will resolve by tonight (~9:00 PM)");
            } else {
                LocalDateTime tonightLate = created.plusHours(4);
                if (tonightLate.toLocalDate().isEqual(created.toLocalDate())) {
                    complaint.setEstimatedResolutionAt(tonightLate);
                    complaint.setEstimatedResolutionText("Will resolve by tonight (~" + tonightLate.format(DateTimeFormatter.ofPattern("h:mm a")) + ")");
                } else {
                    LocalDateTime tomorrowMorning = created.toLocalDate().plusDays(1).atTime(10, 0);
                    complaint.setEstimatedResolutionAt(tomorrowMorning);
                    complaint.setEstimatedResolutionText("Will resolve by tomorrow morning (~10:00 AM)");
                }
            }
        } else if (priority == Priority.MEDIUM) {
            LocalDateTime tomorrow = created.plusHours(24);
            complaint.setEstimatedResolutionAt(tomorrow);
            complaint.setEstimatedResolutionText("Will resolve by tomorrow (~" + tomorrow.format(DateTimeFormatter.ofPattern("h:mm a")) + ")");
        } else {
            LocalDateTime later = created.plusDays(3);
            complaint.setEstimatedResolutionAt(later);
            complaint.setEstimatedResolutionText("Will resolve within 2-3 business days");
        }
    }

    private void logActivity(Long complaintId, String action, String description, String performedBy) {
        ComplaintActivity activity = new ComplaintActivity(complaintId, action, description, performedBy);
        activityRepository.save(activity);
    }

    private synchronized String generateTicketNumber() {
        long count = complaintRepository.count() + 1;
        return String.format("RN-2026-%06d", count);
    }

    private String resolveDefaultDepartment(Category category) {
        return switch (category) {
            case TECHNICAL -> "Technical Support";
            case BILLING -> "Billing & Finance";
            case ACCOUNT -> "Account Management";
            case SERVICE -> "Customer Service";
            case FACILITY -> "Facility";
            case OTHER -> "Customer Service";
        };
    }
}
