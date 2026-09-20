package com.resolvenow.complaint.client;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Qualifier;

@Component
public class AssignmentClient {

    private static final Logger log = LoggerFactory.getLogger(AssignmentClient.class);
    private final RestClient.Builder restClientBuilder;

    public AssignmentClient(@Qualifier("loadBalancedRestClientBuilder") RestClient.Builder restClientBuilder) {
        this.restClientBuilder = restClientBuilder;
    }

    public void triggerAssignment(Long complaintId, String department, String priority) {
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("complaintId", complaintId);
            payload.put("department", department);
            payload.put("priority", priority);

            restClientBuilder.build()
                    .post()
                    .uri("http://ASSIGNMENT-SERVICE/api/assignments/auto-assign")
                    .body(payload)
                    .retrieve()
                    .toBodilessEntity();
            log.info("Dispatched assignment trigger to ASSIGNMENT-SERVICE for complaint {}", complaintId);
        } catch (Exception e) {
            log.warn("Failed to trigger assignment via ASSIGNMENT-SERVICE: {}", e.getMessage());
        }
    }
}
