package com.resolvenow.complaint.dto;

import jakarta.validation.constraints.NotBlank;

public class AssignTicketRequest {

    @NotBlank(message = "Department is required")
    private String department;

    private Long agentId;
    private String agentName;
    private String remarks;
    private String assignedBy;

    public AssignTicketRequest() {
    }

    public AssignTicketRequest(String department, Long agentId, String agentName, String remarks, String assignedBy) {
        this.department = department;
        this.agentId = agentId;
        this.agentName = agentName;
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
