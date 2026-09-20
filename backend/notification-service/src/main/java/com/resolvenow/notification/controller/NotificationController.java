package com.resolvenow.notification.controller;

import com.resolvenow.notification.dto.ApiResponse;
import com.resolvenow.notification.dto.CreateNotificationRequest;
import com.resolvenow.notification.dto.NotificationDto;
import com.resolvenow.notification.service.NotificationService;
import com.resolvenow.notification.service.UserSseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@Tag(name = "Notification Management", description = "Endpoints for user notifications, unread badges, and real-time streaming")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserSseService userSseService;

    public NotificationController(NotificationService notificationService, UserSseService userSseService) {
        this.notificationService = notificationService;
        this.userSseService = userSseService;
    }

    @PostMapping
    @Operation(summary = "Create a notification (used internally and by microservices)")
    public ResponseEntity<ApiResponse<NotificationDto>> createNotification(@Valid @RequestBody CreateNotificationRequest request) {
        NotificationDto dto = notificationService.createNotification(request);
        return new ResponseEntity<>(ApiResponse.ok("Notification created", dto), HttpStatus.CREATED);
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get all notifications for a user")
    public ResponseEntity<ApiResponse<List<NotificationDto>>> getNotificationsByUser(@PathVariable Long userId) {
        List<NotificationDto> list = notificationService.getNotificationsByUser(userId);
        return ResponseEntity.ok(ApiResponse.ok("Notifications retrieved", list));
    }

    @GetMapping("/unread/{userId}")
    @Operation(summary = "Get unread notifications for a user")
    public ResponseEntity<ApiResponse<List<NotificationDto>>> getUnreadNotifications(@PathVariable Long userId) {
        List<NotificationDto> list = notificationService.getUnreadNotificationsByUser(userId);
        return ResponseEntity.ok(ApiResponse.ok("Unread notifications retrieved", list));
    }

    @GetMapping("/unread-count/{userId}")
    @Operation(summary = "Get unread notification count for notification badge")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getUnreadCount(@PathVariable Long userId) {
        long count = notificationService.getUnreadCount(userId);
        return ResponseEntity.ok(ApiResponse.ok("Unread count retrieved", Map.of("count", count)));
    }

    @PatchMapping("/{id}/read")
    @Operation(summary = "Mark a notification as read")
    public ResponseEntity<ApiResponse<NotificationDto>> markAsRead(@PathVariable Long id) {
        NotificationDto dto = notificationService.markAsRead(id);
        return ResponseEntity.ok(ApiResponse.ok("Notification marked as read", dto));
    }

    @PatchMapping("/user/{userId}/read-all")
    @Operation(summary = "Mark all notifications as read for a user")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(@PathVariable Long userId) {
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok(ApiResponse.ok("All notifications marked as read"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a notification")
    public ResponseEntity<ApiResponse<Void>> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.ok(ApiResponse.ok("Notification deleted"));
    }

    @GetMapping(value = "/stream/{userId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    @Operation(summary = "Server-Sent Events (SSE) stream for user live notifications")
    public SseEmitter streamNotifications(@PathVariable Long userId) {
        return userSseService.subscribe(userId);
    }
}
