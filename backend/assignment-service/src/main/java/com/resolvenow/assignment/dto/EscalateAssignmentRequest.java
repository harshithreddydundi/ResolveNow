package com.resolvenow.assignment.dto;

import jakarta.validation.constraints.NotBlank;

public class EscalateAssignmentRequest {

    @NotBlank(message = "Reason is required")
    private String reason;

    private String targetDepartment;
    private String escalatedBy;

    public EscalateAssignmentRequest() {
    }

    public EscalateAssignmentRequest(String reason, String targetDepartment, String escalatedBy) {
        this.reason = reason;
        this.targetDepartment = targetDepartment;
        this.escalatedBy = escalatedBy;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getTargetDepartment() {
        return targetDepartment;
    }

    public void setTargetDepartment(String targetDepartment) {
        this.targetDepartment = targetDepartment;
    }

    public String getEscalatedBy() {
        return escalatedBy;
    }

    public void setEscalatedBy(String escalatedBy) {
        this.escalatedBy = escalatedBy;
    }
}
