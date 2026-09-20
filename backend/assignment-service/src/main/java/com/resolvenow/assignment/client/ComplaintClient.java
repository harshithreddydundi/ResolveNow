package com.resolvenow.assignment.client;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Qualifier;

@Component
public class ComplaintClient {

    private static final Logger log = LoggerFactory.getLogger(ComplaintClient.class);
    private final RestClient.Builder restClientBuilder;

    public ComplaintClient(@Qualifier("loadBalancedRestClientBuilder") RestClient.Builder restClientBuilder) {
        this.restClientBuilder = restClientBuilder;
    }

    public void updateComplaintAssignment(Long complaintId, String department, Long agentId, String agentName, String assignedBy) {
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("department", department);
            payload.put("agentId", agentId);
            payload.put("agentName", agentName);
            payload.put("assignedBy", assignedBy);

            restClientBuilder.build()
                    .patch()
                    .uri("http://COMPLAINT-SERVICE/api/complaints/" + complaintId + "/assign")
                    .body(payload)
                    .retrieve()
                    .toBodilessEntity();
            log.info("Synced assignment update to COMPLAINT-SERVICE for complaint {}", complaintId);
        } catch (Exception e) {
            log.warn("Failed to sync assignment to COMPLAINT-SERVICE: {}", e.getMessage());
        }
    }

    public void escalateComplaint(Long complaintId, String reason, String targetDept, String escalatedBy) {
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("reason", reason);
            payload.put("targetDepartment", targetDept);
            payload.put("escalatedBy", escalatedBy);

            restClientBuilder.build()
                    .patch()
                    .uri("http://COMPLAINT-SERVICE/api/complaints/" + complaintId + "/escalate")
                    .body(payload)
                    .retrieve()
                    .toBodilessEntity();
            log.info("Synced escalation to COMPLAINT-SERVICE for complaint {}", complaintId);
        } catch (Exception e) {
            log.warn("Failed to sync escalation to COMPLAINT-SERVICE: {}", e.getMessage());
        }
    }
}
