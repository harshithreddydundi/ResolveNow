package com.resolvenow.assignment;

import com.resolvenow.assignment.dto.*;
import com.resolvenow.assignment.repository.AssignmentHistoryRepository;
import com.resolvenow.assignment.repository.AssignmentRepository;
import com.resolvenow.assignment.service.AssignmentService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class AssignmentServiceTests {

    @Autowired
    private AssignmentService assignmentService;

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private AssignmentHistoryRepository historyRepository;

    @Test
    void testAssignTicketAndRecordHistory() {
        AssignRequest req = new AssignRequest(999L, "Technical Support", 4L, "Alex Rivera", "Manager Sarah", "Initial assignment");
        AssignmentDto assigned = assignmentService.assignComplaint(req);

        assertNotNull(assigned);
        assertEquals(999L, assigned.getComplaintId());
        assertEquals("Technical Support", assigned.getDepartment());
        assertEquals(4L, assigned.getAgentId());
        assertEquals("ASSIGNED", assigned.getStatus());

        List<AssignmentHistoryDto> history = assignmentService.getAssignmentHistory(999L);
        assertFalse(history.isEmpty());
        assertEquals("ASSIGN", history.get(0).getAction());
        assertEquals("Technical Support", history.get(0).getNewDepartment());
    }

    @Test
    void testReassignTicketUpdatesHistory() {
        AssignRequest req = new AssignRequest(888L, "Billing & Finance", 6L, "Marcus Vance", "Manager David", "Initial");
        assignmentService.assignComplaint(req);

        ReassignRequest reassign = new ReassignRequest("Customer Service", 7L, "Chloe Bennett", "Reassigning to tier 1", "Manager David");
        AssignmentDto reassigned = assignmentService.reassignComplaint(888L, reassign);

        assertEquals("Customer Service", reassigned.getDepartment());
        assertEquals(7L, reassigned.getAgentId());
        assertEquals("REASSIGNED", reassigned.getStatus());

        List<AssignmentHistoryDto> history = assignmentService.getAssignmentHistory(888L);
        assertTrue(history.size() >= 2);
        assertEquals("REASSIGN", history.get(0).getAction());
    }

    @Test
    void testEscalateTicket() {
        AssignRequest req = new AssignRequest(777L, "Technical Support", 5L, "Emily Zhao", "Auto-Router", "Auto");
        assignmentService.assignComplaint(req);

        EscalateAssignmentRequest esc = new EscalateAssignmentRequest("Critical database issue", "Technical Support", "Manager Sarah");
        AssignmentDto escalated = assignmentService.escalateComplaint(777L, esc);

        assertEquals("ESCALATED", escalated.getStatus());
        assertTrue(escalated.getRemarks().contains("Critical database issue"));
    }

    @Test
    void testAgentWorkloads() {
        List<AgentWorkloadDto> workloads = assignmentService.getAgentWorkloads();
        assertNotNull(workloads);
        assertFalse(workloads.isEmpty());
        assertNotNull(workloads.get(0).getAgentName());
        assertNotNull(workloads.get(0).getWorkloadStatus());
    }
}
