package com.resolvenow.assignment.dto;

import com.resolvenow.assignment.entity.Assignment;
import java.time.LocalDateTime;

public class AssignmentDto {

    private Long id;
    private Long complaintId;
    private String department;
    private Long agentId;
    private String agentName;
    private String assignedBy;
    private LocalDateTime assignedAt;
    private String status;
    private String remarks;

    public AssignmentDto() {
    }

    public static AssignmentDto fromEntity(Assignment a) {
        if (a == null) return null;
        AssignmentDto dto = new AssignmentDto();
        dto.setId(a.getId());
        dto.setComplaintId(a.getComplaintId());
        dto.setDepartment(a.getDepartment());
        dto.setAgentId(a.getAgentId());
        dto.setAgentName(a.getAgentName());
        dto.setAssignedBy(a.getAssignedBy());
        dto.setAssignedAt(a.getAssignedAt());
        dto.setStatus(a.getStatus());
        dto.setRemarks(a.getRemarks());
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

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public Long getAgentId() {
        return agentId;
    }

    public void setAgentId(Long agentId) {
        this.agentId = agentId;
    }

    public String getAgentName() {
        return agentName;
    }

    public void setAgentName(String agentName) {
        this.agentName = agentName;
    }

    public String getAssignedBy() {
        return assignedBy;
    }

    public void setAssignedBy(String assignedBy) {
        this.assignedBy = assignedBy;
    }

    public LocalDateTime getAssignedAt() {
        return assignedAt;
    }

    public void setAssignedAt(LocalDateTime assignedAt) {
        this.assignedAt = assignedAt;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}
