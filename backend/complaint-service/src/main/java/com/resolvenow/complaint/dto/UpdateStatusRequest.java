package com.resolvenow.complaint.dto;

import com.resolvenow.complaint.entity.Status;
import jakarta.validation.constraints.NotNull;

public class UpdateStatusRequest {

    @NotNull(message = "Status is required")
    private Status status;

    private String remarks;
    private String updatedBy;

    public UpdateStatusRequest() {
    }

    public UpdateStatusRequest(Status status, String remarks, String updatedBy) {
        this.status = status;
        this.remarks = remarks;
        this.updatedBy = updatedBy;
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
}
