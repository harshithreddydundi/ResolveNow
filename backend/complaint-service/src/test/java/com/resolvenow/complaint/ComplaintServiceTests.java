package com.resolvenow.complaint;

import com.resolvenow.complaint.dto.*;
import com.resolvenow.complaint.entity.*;
import com.resolvenow.complaint.exception.BadRequestException;
import com.resolvenow.complaint.repository.ComplaintRepository;
import com.resolvenow.complaint.service.ComplaintService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class ComplaintServiceTests {

    @Autowired
    private ComplaintService complaintService;

    @Autowired
    private ComplaintRepository complaintRepository;

    @Test
    void testCreateComplaintGeneratesTicketNumberAndSaves() {
        CreateComplaintRequest req = new CreateComplaintRequest();
        req.setTitle("Unit Test Network Outage");
        req.setDescription("Intermittent packet loss on switch SW-04 in rack 2");
        req.setCategory(Category.TECHNICAL);
        req.setPriority(Priority.HIGH);
        req.setCustomerId(9L);
        req.setCustomerName("Alice Morgan");
        req.setCustomerEmail("customer1@resolvenow.com");

        ComplaintDto created = complaintService.createComplaint(req);

        assertNotNull(created);
        assertNotNull(created.getId());
        assertNotNull(created.getTicketNumber());
        assertTrue(created.getTicketNumber().startsWith("RN-2026-"));
        assertEquals(Status.OPEN, created.getStatus());
        assertEquals("Technical Support", created.getDepartment());
        assertNotNull(created.getEstimatedResolutionText());
        assertNotNull(created.getEstimatedResolutionAt());
    }

    @Test
    void testValidLifecycleTransitions() {
        CreateComplaintRequest req = new CreateComplaintRequest();
        req.setTitle("Lifecycle Test Ticket");
        req.setDescription("Detailed description of issue for testing transitions");
        req.setCategory(Category.BILLING);
        req.setPriority(Priority.MEDIUM);
        req.setCustomerId(10L);
        req.setCustomerName("Robert Hughes");

        ComplaintDto created = complaintService.createComplaint(req);
        Long id = created.getId();

        // 1. Assign ticket
        AssignTicketRequest assignReq = new AssignTicketRequest("Billing & Finance", 6L, "Marcus Vance", "Assigned", "Manager");
        ComplaintDto assigned = complaintService.assignTicket(id, assignReq);
        assertEquals(Status.ASSIGNED, assigned.getStatus());
        assertEquals(6L, assigned.getAssignedAgentId());

        // 2. Move to IN_PROGRESS
        UpdateStatusRequest inProgReq = new UpdateStatusRequest(Status.IN_PROGRESS, "Started investigating", "Marcus Vance");
        ComplaintDto inProg = complaintService.updateStatus(id, inProgReq);
        assertEquals(Status.IN_PROGRESS, inProg.getStatus());

        // 3. Move to RESOLVED
        ComplaintDto resolved = complaintService.resolveTicket(id, "Marcus Vance", "Refund issued");
        assertEquals(Status.RESOLVED, resolved.getStatus());
        assertNotNull(resolved.getResolvedAt());

        // 4. Move to CLOSED
        ComplaintDto closed = complaintService.closeTicket(id, "Robert Hughes", "Confirmed resolved");
        assertEquals(Status.CLOSED, closed.getStatus());
        assertNotNull(closed.getClosedAt());
    }

    @Test
    void testIllegalTransitionThrowsBadRequestException() {
        CreateComplaintRequest req = new CreateComplaintRequest();
        req.setTitle("Invalid Transition Test Ticket");
        req.setDescription("Ticket to test invalid status jumping directly from OPEN to RESOLVED");
        req.setCategory(Category.SERVICE);
        req.setPriority(Priority.LOW);
        req.setCustomerId(11L);
        req.setCustomerName("Jessica Tan");

        ComplaintDto created = complaintService.createComplaint(req);
        Long id = created.getId();

        // OPEN cannot jump directly to RESOLVED
        assertThrows(BadRequestException.class, () -> complaintService.resolveTicket(id, "Agent", "Direct resolve"));
    }

    @Test
    void testReopenTicketWorkflow() {
        CreateComplaintRequest req = new CreateComplaintRequest();
        req.setTitle("Reopen Workflow Ticket");
        req.setDescription("Ticket description for reopen testing");
        req.setCategory(Category.FACILITY);
        req.setPriority(Priority.MEDIUM);
        req.setCustomerId(12L);
        req.setCustomerName("Michael Brown");

        ComplaintDto created = complaintService.createComplaint(req);
        Long id = created.getId();

        complaintService.assignTicket(id, new AssignTicketRequest("Facility", 8L, "Liam Cooper", "Assigned", "Manager"));
        complaintService.updateStatus(id, new UpdateStatusRequest(Status.IN_PROGRESS, "Working", "Liam Cooper"));
        complaintService.resolveTicket(id, "Liam Cooper", "Fixed HVAC");

        // Customer reopens ticket
        ComplaintDto reopened = complaintService.reopenTicket(id, "Michael Brown", "Temperature rising again");
        assertEquals(Status.REOPENED, reopened.getStatus());
        assertNull(reopened.getResolvedAt());
    }

    @Test
    void testEscalateTicket() {
        CreateComplaintRequest req = new CreateComplaintRequest();
        req.setTitle("Escalation Candidate Ticket");
        req.setDescription("Production critical issue requiring escalation");
        req.setCategory(Category.TECHNICAL);
        req.setPriority(Priority.MEDIUM);
        req.setCustomerId(9L);
        req.setCustomerName("Alice Morgan");

        ComplaintDto created = complaintService.createComplaint(req);
        Long id = created.getId();

        EscalateTicketRequest escReq = new EscalateTicketRequest("SLA at risk, escalating to L3", "Technical Support", "Manager Sarah");
        ComplaintDto escalated = complaintService.escalateTicket(id, escReq);

        assertEquals(Status.ESCALATED, escalated.getStatus());
        assertEquals(Priority.CRITICAL, escalated.getPriority());
    }

    @Test
    void testAnalyticsSummaryCalculation() {
        AnalyticsSummaryDto summary = complaintService.getAnalyticsSummary();
        assertNotNull(summary);
        assertTrue(summary.getTotalTickets() > 0);
        assertNotNull(summary.getByStatus());
        assertNotNull(summary.getByPriority());
        assertNotNull(summary.getByDepartment());
    }
}
