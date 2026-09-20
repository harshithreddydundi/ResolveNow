package com.resolvenow.assignment.client;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Qualifier;

@Component
public class NotificationClient {

    private static final Logger log = LoggerFactory.getLogger(NotificationClient.class);
    private final RestClient.Builder restClientBuilder;

    public NotificationClient(@Qualifier("loadBalancedRestClientBuilder") RestClient.Builder restClientBuilder) {
        this.restClientBuilder = restClientBuilder;
    }

    public void sendNotification(Long userId, Long complaintId, String type, String title, String message) {
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("userId", userId);
            payload.put("complaintId", complaintId);
            payload.put("type", type);
            payload.put("title", title);
            payload.put("message", message);

            restClientBuilder.build()
                    .post()
                    .uri("http://NOTIFICATION-SERVICE/api/notifications")
                    .body(payload)
                    .retrieve()
                    .toBodilessEntity();
            log.info("Dispatched notification from ASSIGNMENT-SERVICE to user {}", userId);
        } catch (Exception e) {
            log.warn("Failed to dispatch notification from ASSIGNMENT-SERVICE: {}", e.getMessage());
        }
    }
}
