package com.resolvenow.notification.service;

import com.resolvenow.notification.dto.CreateNotificationRequest;
import com.resolvenow.notification.dto.NotificationDto;
import com.resolvenow.notification.entity.Notification;
import com.resolvenow.notification.exception.ResourceNotFoundException;
import com.resolvenow.notification.repository.NotificationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    private final NotificationRepository notificationRepository;
    private final UserSseService userSseService;

    public NotificationService(NotificationRepository notificationRepository, UserSseService userSseService) {
        this.notificationRepository = notificationRepository;
        this.userSseService = userSseService;
    }

    @Transactional
    public NotificationDto createNotification(CreateNotificationRequest req) {
        Notification notification = new Notification(
                req.getUserId(),
                req.getComplaintId(),
                req.getType(),
                req.getTitle(),
                req.getMessage()
        );

        Notification saved = notificationRepository.save(notification);
        NotificationDto dto = NotificationDto.fromEntity(saved);

        // Push real-time event to active user browsers
        userSseService.pushNotification(saved.getUserId(), dto);
        log.info("Notification created for user {}: {}", saved.getUserId(), saved.getTitle());
        return dto;
    }

    public List<NotificationDto> getNotificationsByUser(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(NotificationDto::fromEntity)
                .collect(Collectors.toList());
    }

    public List<NotificationDto> getUnreadNotificationsByUser(Long userId) {
        return notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId).stream()
                .map(NotificationDto::fromEntity)
                .collect(Collectors.toList());
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    @Transactional
    public NotificationDto markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + id));

        notification.setIsRead(true);
        Notification updated = notificationRepository.save(notification);
        return NotificationDto.fromEntity(updated);
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        notificationRepository.markAllAsReadByUserId(userId);
    }

    public NotificationDto getNotificationById(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + id));
        return NotificationDto.fromEntity(notification);
    }

    @Transactional
    public NotificationDto updateNotification(Long id, com.resolvenow.notification.dto.UpdateNotificationRequest req) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + id));

        if (req.getTitle() != null && !req.getTitle().isBlank()) {
            notification.setTitle(req.getTitle());
        }
        if (req.getMessage() != null && !req.getMessage().isBlank()) {
            notification.setMessage(req.getMessage());
        }
        if (req.getIsRead() != null) {
            notification.setIsRead(req.getIsRead());
        }

        Notification updated = notificationRepository.save(notification);
        log.info("Updated notification {}", id);
        return NotificationDto.fromEntity(updated);
    }

    @Transactional
    public void deleteNotification(Long id) {
        if (!notificationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Notification not found with id: " + id);
        }
        notificationRepository.deleteById(id);
        log.info("Deleted notification {}", id);
    }

    @Transactional
    public void clearAllNotifications(Long userId) {
        notificationRepository.deleteByUserId(userId);
        log.info("Cleared all notifications for user {}", userId);
    }
}
