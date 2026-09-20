package com.resolvenow.assignment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class AssignRequest {

    @NotNull(message = "Complaint ID is required")
    private Long complaintId;

    @NotBlank(message = "Department is required")
    private String department;

    private Long agentId;
    private String agentName;
    private String assignedBy;
    private String remarks;

    public AssignRequest() {
    }

    public AssignRequest(Long complaintId, String department, Long agentId, String agentName, String assignedBy, String remarks) {
        this.complaintId = complaintId;
        this.department = department;
        this.agentId = agentId;
        this.agentName = agentName;
        this.assignedBy = assignedBy;
        this.remarks = remarks;
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

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}
