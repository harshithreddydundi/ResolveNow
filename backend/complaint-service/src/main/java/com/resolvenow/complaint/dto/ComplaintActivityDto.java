package com.resolvenow.complaint.dto;

import com.resolvenow.complaint.entity.ComplaintActivity;
import java.time.LocalDateTime;

public class ComplaintActivityDto {

    private Long id;
    private Long complaintId;
    private String action;
    private String description;
    private String performedBy;
    private LocalDateTime timestamp;

    public ComplaintActivityDto() {
    }

    public static ComplaintActivityDto fromEntity(ComplaintActivity a) {
        if (a == null) return null;
        ComplaintActivityDto dto = new ComplaintActivityDto();
        dto.setId(a.getId());
        dto.setComplaintId(a.getComplaintId());
        dto.setAction(a.getAction());
        dto.setDescription(a.getDescription());
        dto.setPerformedBy(a.getPerformedBy());
        dto.setTimestamp(a.getTimestamp());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getComplaintId() {
        return complaintId;
    }

    public void setComplaintId(Long complaintId) {
        this.complaintId = complaintId;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPerformedBy() {
        return performedBy;
    }

    public void setPerformedBy(String performedBy) {
        this.performedBy = performedBy;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
