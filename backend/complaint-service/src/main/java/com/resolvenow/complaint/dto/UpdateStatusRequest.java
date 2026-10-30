package com.resolvenow.complaint.dto;

import com.resolvenow.complaint.entity.Status;
import jakarta.validation.constraints.NotNull;

public class UpdateStatusRequest {

    @NotNull(message = "Status is required")
    private Status status;

    private String remarks;
    private String updatedBy;
    private String estimatedResolutionText;
    private java.time.LocalDateTime estimatedResolutionAt;

    public UpdateStatusRequest() {
    }

    public UpdateStatusRequest(Status status, String remarks, String updatedBy) {
        this.status = status;
        this.remarks = remarks;
        this.updatedBy = updatedBy;
    }

    public UpdateStatusRequest(Status status, String remarks, String updatedBy, String estimatedResolutionText) {
        this.status = status;
        this.remarks = remarks;
        this.updatedBy = updatedBy;
        this.estimatedResolutionText = estimatedResolutionText;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public String getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }

    public String getEstimatedResolutionText() {
        return estimatedResolutionText;
    }

    public void setEstimatedResolutionText(String estimatedResolutionText) {
        this.estimatedResolutionText = estimatedResolutionText;
    }

    public java.time.LocalDateTime getEstimatedResolutionAt() {
        return estimatedResolutionAt;
    }

    public void setEstimatedResolutionAt(java.time.LocalDateTime estimatedResolutionAt) {
        this.estimatedResolutionAt = estimatedResolutionAt;
    }
}
