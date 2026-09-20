package com.resolvenow.assignment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ReassignRequest {

    @NotBlank(message = "New department is required")
    private String newDepartment;

    private Long newAgentId;
    private String newAgentName;
    private String remarks;
    private String reassignedBy;

    public ReassignRequest() {
    }

    public ReassignRequest(String newDepartment, Long newAgentId, String newAgentName, String remarks, String reassignedBy) {
        this.newDepartment = newDepartment;
        this.newAgentId = newAgentId;
        this.newAgentName = newAgentName;
        this.remarks = remarks;
        this.reassignedBy = reassignedBy;
    }

    public String getNewDepartment() {
        return newDepartment;
    }

    public void setNewDepartment(String newDepartment) {
        this.newDepartment = newDepartment;
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

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public String getReassignedBy() {
        return reassignedBy;
    }

    public void setReassignedBy(String reassignedBy) {
        this.reassignedBy = reassignedBy;
    }
}
