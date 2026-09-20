package com.resolvenow.notification.config;

import com.resolvenow.notification.entity.Notification;
import com.resolvenow.notification.entity.NotificationType;
import com.resolvenow.notification.repository.NotificationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);
    private final NotificationRepository notificationRepository;

    public DataInitializer(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Override
    public void run(String... args) {
        if (notificationRepository.count() == 0) {
            log.info("Seeding initial notifications for development accounts...");

            List<Notification> seed = Arrays.asList(
                    // Notifications for Customer 1 (Alice Morgan - ID: 9)
                    new Notification(9L, 1L, NotificationType.TICKET_ESCALATED, "Ticket Escalated: RN-2026-000001", "Your issue regarding PostgreSQL database connection pool has been escalated to Critical."),
                    new Notification(9L, 5L, NotificationType.TICKET_STATUS_CHANGED, "Status Updated: RN-2026-000005", "Server Room B secondary HVAC ticket has moved to IN_PROGRESS."),
                    new Notification(9L, 1L, NotificationType.TICKET_ASSIGNED, "Ticket Assigned: RN-2026-000001", "Assigned to Technical Support and senior engineer Alex Rivera."),

                    // Notifications for Customer 2 (Robert Hughes - ID: 10)
                    new Notification(10L, 2L, NotificationType.TICKET_STATUS_CHANGED, "Status Updated: RN-2026-000002", "Billing discrepancy invoice verification is now IN_PROGRESS."),
                    new Notification(10L, 7L, NotificationType.TICKET_CLOSED, "Ticket Closed: RN-2026-000007", "Webhook callback retry configuration closed successfully."),

                    // Notifications for Customer 3 (Jessica Tan - ID: 11)
                    new Notification(11L, 3L, NotificationType.TICKET_ASSIGNED, "Ticket Assigned: RN-2026-000003", "Okta SAML 2.0 cert issue assigned to Emily Zhao in Technical Support."),
                    new Notification(11L, 8L, NotificationType.TICKET_REOPENED, "Ticket Reopened: RN-2026-000008", "Email notification latency ticket reopened by customer."),

                    // Notifications for Agent Alex Rivera (ID: 4)
                    new Notification(4L, 1L, NotificationType.TICKET_ASSIGNED, "Critical Assignment: RN-2026-000001", "You have been assigned to investigate DB pool exhaustion."),
                    new Notification(4L, 11L, NotificationType.TICKET_ASSIGNED, "Security Ticket: RN-2026-000011", "Investigating suspicious login attempts from quarantined IP range."),

                    // Notifications for Admin (ID: 1)
                    new Notification(1L, null, NotificationType.SYSTEM, "System Health Report", "All 5 ResolveNow microservices active and registered with Eureka."),
                    new Notification(1L, 1L, NotificationType.TICKET_ESCALATED, "SLA Alert: RN-2026-000001", "Ticket RN-2026-000001 escalated to CRITICAL priority.")
            );

            notificationRepository.saveAll(seed);
            log.info("Successfully seeded {} notifications.", seed.size());
        }
    }
}
