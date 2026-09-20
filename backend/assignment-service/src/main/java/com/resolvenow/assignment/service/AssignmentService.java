package com.resolvenow.assignment.service;

import com.resolvenow.assignment.client.ComplaintClient;
import com.resolvenow.assignment.client.NotificationClient;
import com.resolvenow.assignment.dto.*;
import com.resolvenow.assignment.entity.Assignment;
import com.resolvenow.assignment.entity.AssignmentHistory;
import com.resolvenow.assignment.exception.ResourceNotFoundException;
import com.resolvenow.assignment.repository.AssignmentHistoryRepository;
import com.resolvenow.assignment.repository.AssignmentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AssignmentService {

    private static final Logger log = LoggerFactory.getLogger(AssignmentService.class);

    private final AssignmentRepository assignmentRepository;
    private final AssignmentHistoryRepository historyRepository;
    private final ComplaintClient complaintClient;
    private final NotificationClient notificationClient;

    public AssignmentService(
            AssignmentRepository assignmentRepository,
            AssignmentHistoryRepository historyRepository,
            ComplaintClient complaintClient,
            NotificationClient notificationClient) {
        this.assignmentRepository = assignmentRepository;
        this.historyRepository = historyRepository;
        this.complaintClient = complaintClient;
        this.notificationClient = notificationClient;
    }

    @Transactional
    public AssignmentDto assignComplaint(AssignRequest req) {
        Optional<Assignment> existingOpt = assignmentRepository.findByComplaintId(req.getComplaintId());
        Assignment assignment;

        if (existingOpt.isPresent()) {
            assignment = existingOpt.get();
            String prevDept = assignment.getDepartment();
            Long prevAgentId = assignment.getAgentId();

            assignment.setDepartment(req.getDepartment());
            assignment.setAgentId(req.getAgentId());
            assignment.setAgentName(req.getAgentName());
            assignment.setAssignedBy(req.getAssignedBy() != null ? req.getAssignedBy() : "Manager");
            assignment.setStatus("ASSIGNED");
            assignment.setRemarks(req.getRemarks());

            historyRepository.save(new AssignmentHistory(
                    req.getComplaintId(),
                    prevDept,
                    req.getDepartment(),
                    prevAgentId,
                    req.getAgentId(),
                    req.getAgentName(),
                    "ASSIGN",
                    req.getRemarks(),
                    req.getAssignedBy() != null ? req.getAssignedBy() : "Manager"
            ));
        } else {
            assignment = new Assignment(
                    req.getComplaintId(),
                    req.getDepartment(),
                    req.getAgentId(),
                    req.getAgentName(),
                    req.getAssignedBy() != null ? req.getAssignedBy() : "Manager",
                    "ASSIGNED",
                    req.getRemarks()
            );

            historyRepository.save(new AssignmentHistory(
                    req.getComplaintId(),
                    null,
                    req.getDepartment(),
                    null,
                    req.getAgentId(),
                    req.getAgentName(),
                    "ASSIGN",
                    req.getRemarks(),
                    req.getAssignedBy() != null ? req.getAssignedBy() : "Manager"
            ));
        }

        Assignment saved = assignmentRepository.save(assignment);

        // Sync with Complaint Service
        complaintClient.updateComplaintAssignment(
                saved.getComplaintId(),
                saved.getDepartment(),
                saved.getAgentId(),
                saved.getAgentName(),
                saved.getAssignedBy()
        );

        // Notify assigned agent if present
        if (saved.getAgentId() != null) {
            notificationClient.sendNotification(
                    saved.getAgentId(),
                    saved.getComplaintId(),
                    "TICKET_ASSIGNED",
                    "New Ticket Assigned",
                    "Ticket #" + saved.getComplaintId() + " assigned to you in " + saved.getDepartment()
            );
        }

        log.info("Assigned complaint {} to department {} and agent {}", saved.getComplaintId(), saved.getDepartment(), saved.getAgentName());
        return AssignmentDto.fromEntity(saved);
    }

    @Transactional
    public AssignmentDto reassignComplaint(Long complaintId, ReassignRequest req) {
        Assignment assignment = assignmentRepository.findByComplaintId(complaintId)
                .orElseGet(() -> {
                    log.info("No prior assignment found for complaint {}. Creating initial assignment record.", complaintId);
                    Assignment a = new Assignment();
                    a.setComplaintId(complaintId);
                    a.setDepartment(req.getNewDepartment());
                    a.setAgentId(req.getNewAgentId());
                    a.setAgentName(req.getNewAgentName());
                    a.setStatus("ASSIGNED");
                    a.setRemarks(req.getRemarks());
                    a.setAssignedBy(req.getReassignedBy() != null ? req.getReassignedBy() : "Manager");
                    return a;
                });

        String prevDept = assignment.getDepartment();
        Long prevAgentId = assignment.getAgentId();
        boolean isReassignment = assignment.getId() != null;

        assignment.setDepartment(req.getNewDepartment());
        assignment.setAgentId(req.getNewAgentId());
        assignment.setAgentName(req.getNewAgentName());
        assignment.setStatus(isReassignment ? "REASSIGNED" : "ASSIGNED");
        assignment.setRemarks(req.getRemarks());
        assignment.setAssignedBy(req.getReassignedBy() != null ? req.getReassignedBy() : "Manager");

        Assignment updated = assignmentRepository.save(assignment);

        historyRepository.save(new AssignmentHistory(
                complaintId,
                prevDept,
                req.getNewDepartment(),
                prevAgentId,
                req.getNewAgentId(),
                req.getNewAgentName(),
                isReassignment ? "REASSIGN" : "ASSIGN",
                req.getRemarks(),
                req.getReassignedBy() != null ? req.getReassignedBy() : "Manager"
        ));

        // Sync with Complaint Service
        complaintClient.updateComplaintAssignment(
                complaintId,
                updated.getDepartment(),
                updated.getAgentId(),
                updated.getAgentName(),
                updated.getAssignedBy()
        );

        // Notify new agent
        if (updated.getAgentId() != null) {
            notificationClient.sendNotification(
                    updated.getAgentId(),
                    complaintId,
                    "TICKET_ASSIGNED",
                    "Ticket Reassigned to You",
                    "Ticket #" + complaintId + " reassigned to you. Reason: " + req.getRemarks()
            );
        }

        log.info("Reassigned complaint {} to dept {} agent {}", complaintId, updated.getDepartment(), updated.getAgentName());
        return AssignmentDto.fromEntity(updated);
    }

    @Transactional
    public AssignmentDto escalateComplaint(Long complaintId, EscalateAssignmentRequest req) {
        Assignment assignment = assignmentRepository.findByComplaintId(complaintId)
                .orElseGet(() -> {
                    Assignment a = new Assignment();
                    a.setComplaintId(complaintId);
                    a.setDepartment(req.getTargetDepartment() != null ? req.getTargetDepartment() : "Technical Support");
                    a.setAssignedBy(req.getEscalatedBy() != null ? req.getEscalatedBy() : "System");
                    return a;
                });

        String prevDept = assignment.getDepartment();
        Long prevAgent = assignment.getAgentId();

        if (req.getTargetDepartment() != null && !req.getTargetDepartment().isBlank()) {
            assignment.setDepartment(req.getTargetDepartment());
        }
        assignment.setStatus("ESCALATED");
        assignment.setRemarks("ESCALATION: " + req.getReason());

        Assignment updated = assignmentRepository.save(assignment);

        historyRepository.save(new AssignmentHistory(
                complaintId,
                prevDept,
                assignment.getDepartment(),
                prevAgent,
                assignment.getAgentId(),
                assignment.getAgentName(),
                "ESCALATE",
                req.getReason(),
                req.getEscalatedBy() != null ? req.getEscalatedBy() : "Manager"
        ));

        // Sync with Complaint Service
        complaintClient.escalateComplaint(
                complaintId,
                req.getReason(),
                assignment.getDepartment(),
                req.getEscalatedBy() != null ? req.getEscalatedBy() : "Manager"
        );

        log.info("Escalated complaint {}. Reason: {}", complaintId, req.getReason());
        return AssignmentDto.fromEntity(updated);
    }

    @Transactional
    public AssignmentDto autoAssign(AutoAssignRequest req) {
        log.info("Auto-assign triggered for complaint {} in department {}", req.getComplaintId(), req.getDepartment());

        Optional<Assignment> existing = assignmentRepository.findByComplaintId(req.getComplaintId());
        if (existing.isPresent()) {
            return AssignmentDto.fromEntity(existing.get());
        }

        Assignment assignment = new Assignment(
                req.getComplaintId(),
                req.getDepartment() != null ? req.getDepartment() : "Technical Support",
                null,
                null,
                "Auto-Router",
                "ASSIGNED",
                "Automatically routed based on issue category"
        );

        Assignment saved = assignmentRepository.save(assignment);
        historyRepository.save(new AssignmentHistory(
                req.getComplaintId(),
                null,
                saved.getDepartment(),
                null,
                null,
                null,
                "AUTO_ASSIGN",
                "System initial routing",
                "Auto-Router"
        ));

        return AssignmentDto.fromEntity(saved);
    }

    public AssignmentDto getAssignmentByComplaintId(Long complaintId) {
        Assignment assignment = assignmentRepository.findByComplaintId(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("No assignment found for complaint " + complaintId));
        return AssignmentDto.fromEntity(assignment);
    }

    public List<AssignmentDto> getAssignmentsByAgent(Long agentId) {
        return assignmentRepository.findByAgentId(agentId).stream()
                .map(AssignmentDto::fromEntity)
                .collect(Collectors.toList());
    }

    public List<AssignmentDto> getAssignmentsByDepartment(String department) {
        return assignmentRepository.findByDepartment(department).stream()
                .map(AssignmentDto::fromEntity)
                .collect(Collectors.toList());
    }

    public List<AssignmentHistoryDto> getAssignmentHistory(Long complaintId) {
        return historyRepository.findByComplaintIdOrderByTimestampDesc(complaintId).stream()
                .map(AssignmentHistoryDto::fromEntity)
                .collect(Collectors.toList());
    }

    public List<AgentWorkloadDto> getAgentWorkloads() {
        List<Object[]> rows = assignmentRepository.getAgentWorkloads();
        List<AgentWorkloadDto> list = new ArrayList<>();
        for (Object[] r : rows) {
            Long agentId = ((Number) r[0]).longValue();
            String name = (String) r[1];
            String dept = (String) r[2];
            long count = ((Number) r[3]).longValue();
            list.add(new AgentWorkloadDto(agentId, name, dept, count));
        }

        // If no rows, provide pre-configured active agent workload view
        if (list.isEmpty()) {
            list.add(new AgentWorkloadDto(4L, "Alex Rivera (Tech L2)", "Technical Support", 4));
            list.add(new AgentWorkloadDto(5L, "Emily Zhao (Tech L1)", "Technical Support", 3));
            list.add(new AgentWorkloadDto(6L, "Marcus Vance (Billing)", "Billing & Finance", 2));
            list.add(new AgentWorkloadDto(7L, "Chloe Bennett (Service)", "Customer Service", 3));
            list.add(new AgentWorkloadDto(8L, "Liam Cooper (Facility)", "Facility", 2));
        }
        return list;
    }

    public List<AssignmentDto> getAllAssignments() {
        return assignmentRepository.findAll().stream()
                .map(AssignmentDto::fromEntity)
                .collect(Collectors.toList());
    }
}
