package com.resolvenow.assignment.dto;

public class UpdateAssignmentRequest {

    private String department;
    private Long agentId;
    private String agentName;
    private String status;
    private String remarks;
    private String assignedBy;

    public UpdateAssignmentRequest() {
    }

    public UpdateAssignmentRequest(String department, Long agentId, String agentName, String status, String remarks, String assignedBy) {
        this.department = department;
        this.agentId = agentId;
        this.agentName = agentName;
        this.status = status;
        this.remarks = remarks;
        this.assignedBy = assignedBy;
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

    public String getAssignedBy() {
        return assignedBy;
    }

    public void setAssignedBy(String assignedBy) {
        this.assignedBy = assignedBy;
    }
}
