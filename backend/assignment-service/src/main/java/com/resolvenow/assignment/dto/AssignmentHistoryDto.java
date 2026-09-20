package com.resolvenow.assignment.dto;

import com.resolvenow.assignment.entity.AssignmentHistory;
import java.time.LocalDateTime;

public class AssignmentHistoryDto {

    private Long id;
    private Long complaintId;
    private String previousDepartment;
    private String newDepartment;
    private Long previousAgentId;
    private Long newAgentId;
    private String newAgentName;
    private String action;
    private String remarks;
    private String performedBy;
    private LocalDateTime timestamp;

    public AssignmentHistoryDto() {
    }

    public static AssignmentHistoryDto fromEntity(AssignmentHistory h) {
        if (h == null) return null;
        AssignmentHistoryDto dto = new AssignmentHistoryDto();
        dto.setId(h.getId());
        dto.setComplaintId(h.getComplaintId());
        dto.setPreviousDepartment(h.getPreviousDepartment());
        dto.setNewDepartment(h.getNewDepartment());
        dto.setPreviousAgentId(h.getPreviousAgentId());
        dto.setNewAgentId(h.getNewAgentId());
        dto.setNewAgentName(h.getNewAgentName());
        dto.setAction(h.getAction());
        dto.setRemarks(h.getRemarks());
        dto.setPerformedBy(h.getPerformedBy());
        dto.setTimestamp(h.getTimestamp());
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

    public String getPreviousDepartment() {
        return previousDepartment;
    }

    public void setPreviousDepartment(String previousDepartment) {
        this.previousDepartment = previousDepartment;
    }

    public String getNewDepartment() {
        return newDepartment;
    }

    public void setNewDepartment(String newDepartment) {
        this.newDepartment = newDepartment;
    }

    public Long getPreviousAgentId() {
        return previousAgentId;
    }

    public void setPreviousAgentId(Long previousAgentId) {
        this.previousAgentId = previousAgentId;
    }

    public Long getNewAgentId() {
        return newAgentId;
    }

    public void setNewAgentId(Long newAgentId) {
        this.newAgentId = newAgentId;
    }

    public String getNewAgentName() {
        return newAgentName;
    }

    public void setNewAgentName(String newAgentName) {
        this.newAgentName = newAgentName;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
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
