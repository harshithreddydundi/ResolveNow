package com.resolvenow.notification;

import com.resolvenow.notification.dto.CreateNotificationRequest;
import com.resolvenow.notification.dto.NotificationDto;
import com.resolvenow.notification.entity.NotificationType;
import com.resolvenow.notification.repository.NotificationRepository;
import com.resolvenow.notification.service.NotificationService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class NotificationServiceTests {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private NotificationRepository notificationRepository;

    @Test
    void testCreateNotification() {
        CreateNotificationRequest req = new CreateNotificationRequest(
                999L, 101L, NotificationType.TICKET_CREATED, "Test Alert", "Ticket #101 created"
        );

        NotificationDto dto = notificationService.createNotification(req);
        assertNotNull(dto);
        assertEquals(999L, dto.getUserId());
        assertEquals("Test Alert", dto.getTitle());
        assertFalse(dto.getIsRead());
    }

    @Test
    void testGetUnreadNotificationsAndCount() {
        notificationService.createNotification(new CreateNotificationRequest(888L, 201L, NotificationType.TICKET_ASSIGNED, "Assignment 1", "Message 1"));
        notificationService.createNotification(new CreateNotificationRequest(888L, 202L, NotificationType.TICKET_STATUS_CHANGED, "Status 2", "Message 2"));

        long unreadCount = notificationService.getUnreadCount(888L);
        assertEquals(2, unreadCount);

        List<NotificationDto> unreadList = notificationService.getUnreadNotificationsByUser(888L);
        assertEquals(2, unreadList.size());
    }

    @Test
    void testMarkAsRead() {
        NotificationDto created = notificationService.createNotification(
                new CreateNotificationRequest(777L, 301L, NotificationType.TICKET_RESOLVED, "Resolved Alert", "Issue resolved")
        );

        assertFalse(created.getIsRead());
        NotificationDto updated = notificationService.markAsRead(created.getId());
        assertTrue(updated.getIsRead());
    }

    @Test
    void testMarkAllAsRead() {
        notificationService.createNotification(new CreateNotificationRequest(666L, 401L, NotificationType.TICKET_CREATED, "Alert A", "A"));
        notificationService.createNotification(new CreateNotificationRequest(666L, 402L, NotificationType.TICKET_CREATED, "Alert B", "B"));

        assertEquals(2, notificationService.getUnreadCount(666L));
        notificationService.markAllAsRead(666L);
        assertEquals(0, notificationService.getUnreadCount(666L));
    }
}
