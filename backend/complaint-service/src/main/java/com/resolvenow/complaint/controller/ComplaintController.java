package com.resolvenow.complaint.controller;

import com.resolvenow.complaint.dto.*;
import com.resolvenow.complaint.entity.Priority;
import com.resolvenow.complaint.entity.Status;
import com.resolvenow.complaint.service.ComplaintService;
import com.resolvenow.complaint.service.SseEmitterService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/complaints")
@Tag(name = "Complaint & Ticket Management", description = "Endpoints for creating, managing, lifecycle transitions, and streaming complaints")
public class ComplaintController {

    private final ComplaintService complaintService;
    private final SseEmitterService sseEmitterService;

    public ComplaintController(ComplaintService complaintService, SseEmitterService sseEmitterService) {
        this.complaintService = complaintService;
        this.sseEmitterService = sseEmitterService;
    }

    @PostMapping
    @Operation(summary = "Log a new customer complaint/ticket")
    public ResponseEntity<ApiResponse<ComplaintDto>> createComplaint(@Valid @RequestBody CreateComplaintRequest request) {
        ComplaintDto dto = complaintService.createComplaint(request);
        return new ResponseEntity<>(ApiResponse.ok("Complaint registered successfully", dto), HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get paginated, filtered, and searchable complaints")
    public ResponseEntity<ApiResponse<Page<ComplaintDto>>> getComplaints(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Status status,
            @RequestParam(required = false) Priority priority,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) Long customerId,
            @RequestParam(required = false) Long agentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        Page<ComplaintDto> complaints = complaintService.getComplaints(search, status, priority, department, customerId, agentId, page, size);
        return ResponseEntity.ok(ApiResponse.ok("Complaints retrieved", complaints));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get complaint by ID")
    public ResponseEntity<ApiResponse<ComplaintDto>> getComplaintById(@PathVariable Long id) {
        ComplaintDto dto = complaintService.getComplaintById(id);
        return ResponseEntity.ok(ApiResponse.ok("Complaint retrieved", dto));
    }

    @GetMapping("/ticket/{ticketNumber}")
    @Operation(summary = "Get complaint by unique ticket number (RN-2026-XXXXXX)")
    public ResponseEntity<ApiResponse<ComplaintDto>> getComplaintByTicketNumber(@PathVariable String ticketNumber) {
        ComplaintDto dto = complaintService.getComplaintByTicketNumber(ticketNumber);
        return ResponseEntity.ok(ApiResponse.ok("Complaint retrieved", dto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update complaint details")
    public ResponseEntity<ApiResponse<ComplaintDto>> updateComplaint(@PathVariable Long id, @RequestBody UpdateComplaintRequest request) {
        ComplaintDto dto = complaintService.updateComplaint(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Complaint updated successfully", dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete complaint by ID")
    public ResponseEntity<ApiResponse<Void>> deleteComplaint(@PathVariable Long id) {
        complaintService.deleteComplaint(id);
        return ResponseEntity.ok(ApiResponse.ok("Complaint deleted successfully"));
    }

    @GetMapping("/customer/{customerId}")
    @Operation(summary = "Get complaints logged by specific customer")
    public ResponseEntity<ApiResponse<List<ComplaintDto>>> getComplaintsByCustomer(@PathVariable Long customerId) {
        List<ComplaintDto> list = complaintService.getComplaintsByCustomerId(customerId);
        return ResponseEntity.ok(ApiResponse.ok("Customer complaints retrieved", list));
    }

    @GetMapping("/agent/{agentId}")
    @Operation(summary = "Get complaints assigned to specific agent")
    public ResponseEntity<ApiResponse<List<ComplaintDto>>> getComplaintsByAgent(@PathVariable Long agentId) {
        List<ComplaintDto> list = complaintService.getComplaintsByAgentId(agentId);
        return ResponseEntity.ok(ApiResponse.ok("Agent complaints retrieved", list));
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get complaints by status")
    public ResponseEntity<ApiResponse<List<ComplaintDto>>> getComplaintsByStatus(@PathVariable Status status) {
        List<ComplaintDto> list = complaintService.getComplaintsByStatus(status);
        return ResponseEntity.ok(ApiResponse.ok("Complaints by status retrieved", list));
    }

    @GetMapping("/department/{department}")
    @Operation(summary = "Get complaints by department")
    public ResponseEntity<ApiResponse<List<ComplaintDto>>> getComplaintsByDepartment(@PathVariable String department) {
        List<ComplaintDto> list = complaintService.getComplaintsByDepartment(department);
        return ResponseEntity.ok(ApiResponse.ok("Department complaints retrieved", list));
    }

    @GetMapping("/priority/{priority}")
    @Operation(summary = "Get complaints by priority")
    public ResponseEntity<ApiResponse<List<ComplaintDto>>> getComplaintsByPriority(@PathVariable Priority priority) {
        List<ComplaintDto> list = complaintService.getComplaintsByPriority(priority);
        return ResponseEntity.ok(ApiResponse.ok("Priority complaints retrieved", list));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update complaint status lifecycle")
    public ResponseEntity<ApiResponse<ComplaintDto>> updateStatus(@PathVariable Long id, @Valid @RequestBody UpdateStatusRequest request) {
        ComplaintDto dto = complaintService.updateStatus(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Status updated successfully", dto));
    }

    @PatchMapping("/{id}/priority")
    @Operation(summary = "Update complaint priority")
    public ResponseEntity<ApiResponse<ComplaintDto>> updatePriority(@PathVariable Long id, @Valid @RequestBody UpdatePriorityRequest request) {
        ComplaintDto dto = complaintService.updatePriority(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Priority updated successfully", dto));
    }

    @PatchMapping("/{id}/assign")
    @Operation(summary = "Assign complaint to department and agent")
    public ResponseEntity<ApiResponse<ComplaintDto>> assignTicket(@PathVariable Long id, @Valid @RequestBody AssignTicketRequest request) {
        ComplaintDto dto = complaintService.assignTicket(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Ticket assigned successfully", dto));
    }

    @PatchMapping("/{id}/escalate")
    @Operation(summary = "Escalate ticket for priority management review")
    public ResponseEntity<ApiResponse<ComplaintDto>> escalateTicket(@PathVariable Long id, @Valid @RequestBody EscalateTicketRequest request) {
        ComplaintDto dto = complaintService.escalateTicket(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Ticket escalated successfully", dto));
    }

    @PatchMapping("/{id}/resolve")
    @Operation(summary = "Mark ticket as resolved")
    public ResponseEntity<ApiResponse<ComplaintDto>> resolveTicket(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {
        String resolvedBy = body != null ? body.get("resolvedBy") : "Agent";
        String remarks = body != null ? body.get("remarks") : "Issue resolved successfully";
        ComplaintDto dto = complaintService.resolveTicket(id, resolvedBy, remarks);
        return ResponseEntity.ok(ApiResponse.ok("Ticket marked as resolved", dto));
    }

    @PatchMapping("/{id}/close")
    @Operation(summary = "Close resolved ticket")
    public ResponseEntity<ApiResponse<ComplaintDto>> closeTicket(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {
        String closedBy = body != null ? body.get("closedBy") : "Customer";
        String remarks = body != null ? body.get("remarks") : "Closed by customer";
        ComplaintDto dto = complaintService.closeTicket(id, closedBy, remarks);
        return ResponseEntity.ok(ApiResponse.ok("Ticket closed", dto));
    }

    @PatchMapping("/{id}/reopen")
    @Operation(summary = "Reopen a previously resolved ticket")
    public ResponseEntity<ApiResponse<ComplaintDto>> reopenTicket(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {
        String reopenedBy = body != null ? body.get("reopenedBy") : "Customer";
        String reason = body != null ? body.get("reason") : "Issue recurred";
        ComplaintDto dto = complaintService.reopenTicket(id, reopenedBy, reason);
        return ResponseEntity.ok(ApiResponse.ok("Ticket reopened", dto));
    }

    @GetMapping("/{id}/activities")
    @Operation(summary = "Get full chronological activity history for a complaint")
    public ResponseEntity<ApiResponse<List<ComplaintActivityDto>>> getActivities(@PathVariable Long id) {
        List<ComplaintActivityDto> activities = complaintService.getActivities(id);
        return ResponseEntity.ok(ApiResponse.ok("Activities retrieved", activities));
    }

    @GetMapping("/analytics/summary")
    @Operation(summary = "Get complaint analytics summary and distributions for dashboard")
    public ResponseEntity<ApiResponse<AnalyticsSummaryDto>> getAnalyticsSummary() {
        AnalyticsSummaryDto summary = complaintService.getAnalyticsSummary();
        return ResponseEntity.ok(ApiResponse.ok("Analytics summary retrieved", summary));
    }

    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    @Operation(summary = "Server-Sent Events (SSE) stream for real-time ticket updates")
    public SseEmitter streamUpdates() {
        return sseEmitterService.subscribe();
    }
}
