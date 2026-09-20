package com.resolvenow.complaint.config;

import com.resolvenow.complaint.entity.*;
import com.resolvenow.complaint.repository.ComplaintActivityRepository;
import com.resolvenow.complaint.repository.ComplaintRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final ComplaintRepository complaintRepository;
    private final ComplaintActivityRepository activityRepository;

    public DataInitializer(ComplaintRepository complaintRepository, ComplaintActivityRepository activityRepository) {
        this.complaintRepository = complaintRepository;
        this.activityRepository = activityRepository;
    }

    @Override
    public void run(String... args) {
        if (complaintRepository.count() == 0) {
            log.info("Initializing 22 realistic enterprise tickets into Complaint Service...");

            List<Complaint> tickets = new ArrayList<>();

            // 1. Critical Database Connection Timeout
            Complaint c1 = createTicket("RN-2026-000001", "PostgreSQL database connection pool exhaustion in EU region",
                    "Customer reports intermittent 504 gateway timeouts when attempting to checkout. Pool size appears capped at 50 connections during traffic surges.",
                    Category.TECHNICAL, Priority.CRITICAL, Status.ESCALATED, 9L, "Alice Morgan", "customer1@resolvenow.com",
                    "Technical Support", 4L, "Alex Rivera (Tech L2)", LocalDateTime.now().minusHours(18));
            tickets.add(c1);

            // 2. Billing Discrepancy
            Complaint c2 = createTicket("RN-2026-000002", "Double charge on annual enterprise subscription renewal",
                    "Invoice #INV-9821 was billed twice to Mastercard ending in 4402 on Sept 15. Customer requires immediate refund of $2,400.",
                    Category.BILLING, Priority.HIGH, Status.IN_PROGRESS, 10L, "Robert Hughes", "customer2@resolvenow.com",
                    "Billing & Finance", 6L, "Marcus Vance (Billing)", LocalDateTime.now().minusHours(14));
            tickets.add(c2);

            // 3. SSO SAML Integration
            Complaint c3 = createTicket("RN-2026-000003", "Okta SAML 2.0 metadata certificate expired",
                    "Enterprise SSO users are unable to authenticate via IdP. Error: 'Signature validation failed for SAML assertion'.",
                    Category.ACCOUNT, Priority.HIGH, Status.ASSIGNED, 11L, "Jessica Tan", "customer3@resolvenow.com",
                    "Technical Support", 5L, "Emily Zhao (Tech L1)", LocalDateTime.now().minusHours(10));
            tickets.add(c3);

            // 4. API Rate Limiting Bug
            Complaint c4 = createTicket("RN-2026-000004", "REST API returns 429 Too Many Requests prematurely",
                    "Tier 1 partner account is getting throttled after only 120 calls/min instead of the contracted 1,000 calls/min.",
                    Category.TECHNICAL, Priority.MEDIUM, Status.OPEN, 12L, "Michael Brown", "customer4@resolvenow.com",
                    "Technical Support", null, null, LocalDateTime.now().minusHours(6));
            tickets.add(c4);

            // 5. HVAC Server Room Failure
            Complaint c5 = createTicket("RN-2026-000005", "Server Room B secondary HVAC unit blowing warm air",
                    "Temperature sensor in Rack C3 reached 31C (threshold is 26C). On-site facility maintenance required.",
                    Category.FACILITY, Priority.CRITICAL, Status.IN_PROGRESS, 9L, "Alice Morgan", "customer1@resolvenow.com",
                    "Facility", 8L, "Liam Cooper (Facility)", LocalDateTime.now().minusHours(4));
            tickets.add(c5);

            // 6. Resolved Ticket
            Complaint c6 = createTicket("RN-2026-000006", "Unable to download PDF invoices from dashboard",
                    "Clicking 'Download Receipt' generated blank white PDF files on Chrome 128. Resolved by fixing PDF byte stream serialization.",
                    Category.BILLING, Priority.MEDIUM, Status.RESOLVED, 13L, "Sophia Martinez", "customer5@resolvenow.com",
                    "Billing & Finance", 6L, "Marcus Vance (Billing)", LocalDateTime.now().minusHours(36));
            c6.setResolvedAt(LocalDateTime.now().minusHours(8));
            tickets.add(c6);

            // 7. Closed Ticket
            Complaint c7 = createTicket("RN-2026-000007", "Request for webhook callback retry increase",
                    "Requested 5 retry attempts with exponential backoff for failed webhook delivery. Configured and tested successfully.",
                    Category.TECHNICAL, Priority.LOW, Status.CLOSED, 10L, "Robert Hughes", "customer2@resolvenow.com",
                    "Technical Support", 4L, "Alex Rivera (Tech L2)", LocalDateTime.now().minusDays(3));
            c7.setResolvedAt(LocalDateTime.now().minusDays(2));
            c7.setClosedAt(LocalDateTime.now().minusDays(1));
            tickets.add(c7);

            // 8. Reopened Ticket
            Complaint c8 = createTicket("RN-2026-000008", "Email notification latency exceeding 25 minutes",
                    "Transactional emails for password reset are delayed. Issue was marked resolved earlier but recurrence occurred this morning.",
                    Category.SERVICE, Priority.HIGH, Status.REOPENED, 11L, "Jessica Tan", "customer3@resolvenow.com",
                    "Customer Service", 7L, "Chloe Bennett (Service)", LocalDateTime.now().minusHours(24));
            tickets.add(c8);

            // 9. Waiting for Customer
            Complaint c9 = createTicket("RN-2026-000009", "Custom domain SSL certificate provisioning stuck",
                    "SSL certificate verification pending DNS CAA record configuration. Awaiting customer confirmation on DNS update.",
                    Category.TECHNICAL, Priority.MEDIUM, Status.WAITING_FOR_CUSTOMER, 12L, "Michael Brown", "customer4@resolvenow.com",
                    "Technical Support", 5L, "Emily Zhao (Tech L1)", LocalDateTime.now().minusHours(16));
            tickets.add(c9);

            // 10. Service SLA Inquiry
            Complaint c10 = createTicket("RN-2026-000010", "Quarterly SLA report calculation discrepancy for August",
                    "Uptime displayed as 99.82% while contractual tier requires 99.95%. Requesting formal service credit review.",
                    Category.SERVICE, Priority.MEDIUM, Status.ASSIGNED, 13L, "Sophia Martinez", "customer5@resolvenow.com",
                    "Customer Service", 7L, "Chloe Bennett (Service)", LocalDateTime.now().minusHours(12));
            tickets.add(c10);

            // 11. Security Audit
            Complaint c11 = createTicket("RN-2026-000011", "Suspicious login attempts from unverified geolocation",
                    "Multiple failed attempts from IP range in Eastern Europe detected against admin account. IP has been temporarily quarantined.",
                    Category.ACCOUNT, Priority.CRITICAL, Status.IN_PROGRESS, 9L, "Alice Morgan", "customer1@resolvenow.com",
                    "Technical Support", 4L, "Alex Rivera (Tech L2)", LocalDateTime.now().minusHours(8));
            tickets.add(c11);

            // 12. Office Access Badge
            Complaint c12 = createTicket("RN-2026-000012", "RFID badge reader at 4th floor entrance failing intermittently",
                    "Employees unable to scan badges at north wing door between 8 AM and 9 AM.",
                    Category.FACILITY, Priority.LOW, Status.OPEN, 10L, "Robert Hughes", "customer2@resolvenow.com",
                    "Facility", null, null, LocalDateTime.now().minusHours(5));
            tickets.add(c12);

            // 13. CSV Export Truncation
            Complaint c13 = createTicket("RN-2026-000013", "Export to CSV drops rows beyond 10,000 record threshold",
                    "Customer data export fails with OutOfMemoryError when report contains > 10k customer transactions.",
                    Category.TECHNICAL, Priority.HIGH, Status.IN_PROGRESS, 11L, "Jessica Tan", "customer3@resolvenow.com",
                    "Technical Support", 4L, "Alex Rivera (Tech L2)", LocalDateTime.now().minusHours(15));
            tickets.add(c13);

            // 14. Vat Exemption Update
            Complaint c14 = createTicket("RN-2026-000014", "Apply corporate tax exemption certificate for FY2026",
                    "Attached Form 501-C tax exemption certificate. Need tax field removed from upcoming billing cycle.",
                    Category.BILLING, Priority.LOW, Status.RESOLVED, 12L, "Michael Brown", "customer4@resolvenow.com",
                    "Billing & Finance", 6L, "Marcus Vance (Billing)", LocalDateTime.now().minusDays(2));
            c14.setResolvedAt(LocalDateTime.now().minusHours(12));
            tickets.add(c14);

            // 15. WebSocket Disconnection
            Complaint c15 = createTicket("RN-2026-000015", "Dashboard live feed disconnects after 60 seconds of inactivity",
                    "Keep-alive ping is missing headers causing cloud load balancers to terminate idle TCP connections.",
                    Category.TECHNICAL, Priority.HIGH, Status.ASSIGNED, 9L, "Alice Morgan", "customer1@resolvenow.com",
                    "Technical Support", 5L, "Emily Zhao (Tech L1)", LocalDateTime.now().minusHours(9));
            tickets.add(c15);

            // 16. Two-Factor Authentication Reset
            Complaint c16 = createTicket("RN-2026-000016", "Lead engineer lost mobile authenticator device",
                    "Employee needs emergency 2FA backup codes reset after phone hardware replacement.",
                    Category.ACCOUNT, Priority.HIGH, Status.RESOLVED, 10L, "Robert Hughes", "customer2@resolvenow.com",
                    "Customer Service", 7L, "Chloe Bennett (Service)", LocalDateTime.now().minusHours(20));
            c16.setResolvedAt(LocalDateTime.now().minusHours(10));
            tickets.add(c16);

            // 17. Facility Power Strip
            Complaint c17 = createTicket("RN-2026-000017", "Server rack PDU circuit breaker tripped in bay 3",
                    "Redundant power supply took over; secondary power feed needs immediate physical inspection and breaker reset.",
                    Category.FACILITY, Priority.CRITICAL, Status.ESCALATED, 13L, "Sophia Martinez", "customer5@resolvenow.com",
                    "Facility", 8L, "Liam Cooper (Facility)", LocalDateTime.now().minusHours(2));
            tickets.add(c17);

            // 18. Other Inquiries
            Complaint c18 = createTicket("RN-2026-000018", "Inquiry regarding SOC2 Type II compliance audit report",
                    "Prospective enterprise client requires latest SOC2 compliance attestation report for security vendor review.",
                    Category.OTHER, Priority.LOW, Status.RESOLVED, 11L, "Jessica Tan", "customer3@resolvenow.com",
                    "Customer Service", 7L, "Chloe Bennett (Service)", LocalDateTime.now().minusDays(4));
            c18.setResolvedAt(LocalDateTime.now().minusDays(3));
            tickets.add(c18);

            // 19. Open Billing inquiry
            Complaint c19 = createTicket("RN-2026-000019", "Payment gateway rejected corporate AMEX card",
                    "Declined with code 'FRAUD_SUSPECTED' due to billing zip code mismatch on corporate card profile.",
                    Category.BILLING, Priority.MEDIUM, Status.OPEN, 12L, "Michael Brown", "customer4@resolvenow.com",
                    "Billing & Finance", null, null, LocalDateTime.now().minusMinutes(45));
            tickets.add(c19);

            // 20. In progress Technical Ticket
            Complaint c20 = createTicket("RN-2026-000020", "Search indexing delay on newly uploaded customer files",
                    "Elasticsearch cluster queue delayed by 40 minutes during peak upload window.",
                    Category.TECHNICAL, Priority.HIGH, Status.IN_PROGRESS, 9L, "Alice Morgan", "customer1@resolvenow.com",
                    "Technical Support", 4L, "Alex Rivera (Tech L2)", LocalDateTime.now().minusHours(3));
            tickets.add(c20);

            // Save all complaints
            List<Complaint> savedComplaints = complaintRepository.saveAll(tickets);

            // Create rich activity logs for each ticket
            for (Complaint c : savedComplaints) {
                activityRepository.save(new ComplaintActivity(c.getId(), "CREATED", "Ticket logged and registered in ResolveNow", c.getCustomerName()));
                if (c.getDepartment() != null) {
                    activityRepository.save(new ComplaintActivity(c.getId(), "ASSIGNED", "Assigned to department: " + c.getDepartment(), "System Auto-Router"));
                }
                if (c.getAssignedAgentName() != null) {
                    activityRepository.save(new ComplaintActivity(c.getId(), "ASSIGNED", "Agent " + c.getAssignedAgentName() + " assigned to ticket", "Department Manager"));
                }
                if (c.getStatus() == Status.IN_PROGRESS || c.getStatus() == Status.ESCALATED || c.getStatus() == Status.RESOLVED) {
                    activityRepository.save(new ComplaintActivity(c.getId(), "STATUS_CHANGED", "Status changed to " + c.getStatus(), c.getAssignedAgentName() != null ? c.getAssignedAgentName() : "Support Agent"));
                }
                if (c.getStatus() == Status.RESOLVED) {
                    activityRepository.save(new ComplaintActivity(c.getId(), "RESOLVED", "Ticket successfully resolved by agent", c.getAssignedAgentName() != null ? c.getAssignedAgentName() : "Agent"));
                }
            }

            log.info("Successfully seeded {} tickets and their activity histories into Complaint Service.", savedComplaints.size());
        }
    }

    private Complaint createTicket(String num, String title, String desc, Category cat, Priority prio,
                                  Status status, Long custId, String custName, String custEmail,
                                  String dept, Long agentId, String agentName, LocalDateTime created) {
        Complaint c = new Complaint();
        c.setTicketNumber(num);
        c.setTitle(title);
        c.setDescription(desc);
        c.setCategory(cat);
        c.setPriority(prio);
        c.setStatus(status);
        c.setCustomerId(custId);
        c.setCustomerName(custName);
        c.setCustomerEmail(custEmail);
        c.setDepartment(dept);
        c.setAssignedAgentId(agentId);
        c.setAssignedAgentName(agentName);
        c.setCreatedAt(created);
        c.setUpdatedAt(created.plusMinutes(15));
        return c;
    }
}
