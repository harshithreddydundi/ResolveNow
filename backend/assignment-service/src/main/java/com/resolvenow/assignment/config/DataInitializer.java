package com.resolvenow.assignment.config;

import com.resolvenow.assignment.entity.Assignment;
import com.resolvenow.assignment.entity.AssignmentHistory;
import com.resolvenow.assignment.repository.AssignmentHistoryRepository;
import com.resolvenow.assignment.repository.AssignmentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final AssignmentRepository assignmentRepository;
    private final AssignmentHistoryRepository historyRepository;

    public DataInitializer(AssignmentRepository assignmentRepository, AssignmentHistoryRepository historyRepository) {
        this.assignmentRepository = assignmentRepository;
        this.historyRepository = historyRepository;
    }

    @Override
    public void run(String... args) {
        if (assignmentRepository.count() == 0) {
            log.info("Seeding initial assignment records...");

            List<Assignment> seed = Arrays.asList(
                    new Assignment(1L, "Technical Support", 4L, "Alex Rivera (Tech L2)", "Manager Sarah", "ESCALATED", "Initial high priority escalation"),
                    new Assignment(2L, "Billing & Finance", 6L, "Marcus Vance (Billing)", "Manager David", "IN_PROGRESS", "Assigned for invoice refund verification"),
                    new Assignment(3L, "Technical Support", 5L, "Emily Zhao (Tech L1)", "Manager Sarah", "ASSIGNED", "Assigned for SAML cert renewal"),
                    new Assignment(5L, "Facility", 8L, "Liam Cooper (Facility)", "Auto-Router", "IN_PROGRESS", "Server room HVAC inspection"),
                    new Assignment(6L, "Billing & Finance", 6L, "Marcus Vance (Billing)", "Manager David", "COMPLETED", "Resolved PDF receipt download"),
                    new Assignment(8L, "Customer Service", 7L, "Chloe Bennett (Service)", "Auto-Router", "REASSIGNED", "Customer service email latency investigation"),
                    new Assignment(9L, "Technical Support", 5L, "Emily Zhao (Tech L1)", "Manager Sarah", "ASSIGNED", "SSL DNS verification"),
                    new Assignment(10L, "Customer Service", 7L, "Chloe Bennett (Service)", "Auto-Router", "ASSIGNED", "SLA credit review"),
                    new Assignment(11L, "Technical Support", 4L, "Alex Rivera (Tech L2)", "Manager Sarah", "IN_PROGRESS", "Security incident response"),
                    new Assignment(13L, "Technical Support", 4L, "Alex Rivera (Tech L2)", "Manager Sarah", "IN_PROGRESS", "CSV export memory fix"),
                    new Assignment(14L, "Billing & Finance", 6L, "Marcus Vance (Billing)", "Manager David", "COMPLETED", "Tax exemption certificate applied"),
                    new Assignment(15L, "Technical Support", 5L, "Emily Zhao (Tech L1)", "Manager Sarah", "ASSIGNED", "WebSocket ping keep-alive fix"),
                    new Assignment(16L, "Customer Service", 7L, "Chloe Bennett (Service)", "Auto-Router", "COMPLETED", "2FA reset complete"),
                    new Assignment(17L, "Facility", 8L, "Liam Cooper (Facility)", "Auto-Router", "ESCALATED", "PDU tripped breaker"),
                    new Assignment(18L, "Customer Service", 7L, "Chloe Bennett (Service)", "Auto-Router", "COMPLETED", "SOC2 report delivered"),
                    new Assignment(20L, "Technical Support", 4L, "Alex Rivera (Tech L2)", "Manager Sarah", "IN_PROGRESS", "Elasticsearch indexing optimization")
            );

            assignmentRepository.saveAll(seed);

            for (Assignment a : seed) {
                historyRepository.save(new AssignmentHistory(
                        a.getComplaintId(),
                        null,
                        a.getDepartment(),
                        null,
                        a.getAgentId(),
                        a.getAgentName(),
                        "ASSIGN",
                        a.getRemarks(),
                        a.getAssignedBy()
                ));
            }

            log.info("Successfully seeded {} assignment records and histories.", seed.size());
        }
    }
}
