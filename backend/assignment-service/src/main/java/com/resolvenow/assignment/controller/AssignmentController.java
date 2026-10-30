package com.resolvenow.assignment.controller;

import com.resolvenow.assignment.dto.*;
import com.resolvenow.assignment.service.AssignmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assignments")
@Tag(name = "Assignment & Workload Management", description = "Endpoints for ticket assignment, agent routing, reassignment, and workload metrics")
public class AssignmentController {

    private final AssignmentService assignmentService;

    public AssignmentController(AssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    @PostMapping
    @Operation(summary = "Create an assignment record for a complaint")
    public ResponseEntity<ApiResponse<AssignmentDto>> createAssignment(@Valid @RequestBody AssignRequest request) {
        AssignmentDto dto = assignmentService.assignComplaint(request);
        return new ResponseEntity<>(ApiResponse.ok("Assignment created successfully", dto), HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get all assignments")
    public ResponseEntity<ApiResponse<List<AssignmentDto>>> getAllAssignments() {
        List<AssignmentDto> list = assignmentService.getAllAssignments();
        return ResponseEntity.ok(ApiResponse.ok("Assignments retrieved", list));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get assignment by ID")
    public ResponseEntity<ApiResponse<AssignmentDto>> getAssignmentById(@PathVariable Long id) {
        AssignmentDto dto = assignmentService.getAssignmentById(id);
        return ResponseEntity.ok(ApiResponse.ok("Assignment retrieved", dto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update assignment details by ID")
    public ResponseEntity<ApiResponse<AssignmentDto>> updateAssignment(@PathVariable Long id, @RequestBody UpdateAssignmentRequest request) {
        AssignmentDto dto = assignmentService.updateAssignment(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Assignment updated successfully", dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete assignment record by ID")
    public ResponseEntity<ApiResponse<Void>> deleteAssignment(@PathVariable Long id) {
        assignmentService.deleteAssignment(id);
        return ResponseEntity.ok(ApiResponse.ok("Assignment deleted successfully"));
    }

    @GetMapping("/complaint/{complaintId}")
    @Operation(summary = "Get current assignment for a complaint")
    public ResponseEntity<ApiResponse<AssignmentDto>> getAssignmentByComplaint(@PathVariable Long complaintId) {
        AssignmentDto dto = assignmentService.getAssignmentByComplaintId(complaintId);
        return ResponseEntity.ok(ApiResponse.ok("Assignment retrieved", dto));
    }

    @GetMapping("/agent/{agentId}")
    @Operation(summary = "Get assignments for a specific agent")
    public ResponseEntity<ApiResponse<List<AssignmentDto>>> getAssignmentsByAgent(@PathVariable Long agentId) {
        List<AssignmentDto> list = assignmentService.getAssignmentsByAgent(agentId);
        return ResponseEntity.ok(ApiResponse.ok("Agent assignments retrieved", list));
    }

    @GetMapping("/department/{department}")
    @Operation(summary = "Get assignments for a specific department")
    public ResponseEntity<ApiResponse<List<AssignmentDto>>> getAssignmentsByDepartment(@PathVariable String department) {
        List<AssignmentDto> list = assignmentService.getAssignmentsByDepartment(department);
        return ResponseEntity.ok(ApiResponse.ok("Department assignments retrieved", list));
    }

    @PostMapping("/{complaintId}/assign")
    @Operation(summary = "Assign or update assignment for a complaint")
    public ResponseEntity<ApiResponse<AssignmentDto>> assignTicket(
            @PathVariable Long complaintId,
            @Valid @RequestBody AssignRequest request) {
        request.setComplaintId(complaintId);
        AssignmentDto dto = assignmentService.assignComplaint(request);
        return ResponseEntity.ok(ApiResponse.ok("Ticket assigned successfully", dto));
    }

    @PostMapping("/{complaintId}/reassign")
    @Operation(summary = "Reassign ticket to another department or agent")
    public ResponseEntity<ApiResponse<AssignmentDto>> reassignTicket(
            @PathVariable Long complaintId,
            @Valid @RequestBody ReassignRequest request) {
        AssignmentDto dto = assignmentService.reassignComplaint(complaintId, request);
        return ResponseEntity.ok(ApiResponse.ok("Ticket reassigned successfully", dto));
    }

    @PostMapping("/{complaintId}/escalate")
    @Operation(summary = "Escalate ticket assignment")
    public ResponseEntity<ApiResponse<AssignmentDto>> escalateTicket(
            @PathVariable Long complaintId,
            @Valid @RequestBody EscalateAssignmentRequest request) {
        AssignmentDto dto = assignmentService.escalateComplaint(complaintId, request);
        return ResponseEntity.ok(ApiResponse.ok("Ticket escalated successfully", dto));
    }

    @PostMapping("/auto-assign")
    @Operation(summary = "Internal trigger for automatic routing from Complaint Service")
    public ResponseEntity<ApiResponse<AssignmentDto>> autoAssign(@RequestBody AutoAssignRequest request) {
        AssignmentDto dto = assignmentService.autoAssign(request);
        return ResponseEntity.ok(ApiResponse.ok("Auto-assign complete", dto));
    }

    @GetMapping("/history/{complaintId}")
    @Operation(summary = "Get chronological assignment and reassignment history for a ticket")
    public ResponseEntity<ApiResponse<List<AssignmentHistoryDto>>> getAssignmentHistory(@PathVariable Long complaintId) {
        List<AssignmentHistoryDto> history = assignmentService.getAssignmentHistory(complaintId);
        return ResponseEntity.ok(ApiResponse.ok("Assignment history retrieved", history));
    }

    @GetMapping("/workload")
    @Operation(summary = "Get active workload distribution per agent for load balancing")
    public ResponseEntity<ApiResponse<List<AgentWorkloadDto>>> getAgentWorkloads() {
        List<AgentWorkloadDto> workloads = assignmentService.getAgentWorkloads();
        return ResponseEntity.ok(ApiResponse.ok("Agent workloads retrieved", workloads));
    }
}
