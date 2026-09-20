package com.resolvenow.complaint.dto;

import jakarta.validation.constraints.NotBlank;

public class EscalateTicketRequest {

    @NotBlank(message = "Escalation reason is required")
    private String reason;

    private String targetDepartment;
    private String escalatedBy;

    public EscalateTicketRequest() {
    }

    public EscalateTicketRequest(String reason, String targetDepartment, String escalatedBy) {
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
