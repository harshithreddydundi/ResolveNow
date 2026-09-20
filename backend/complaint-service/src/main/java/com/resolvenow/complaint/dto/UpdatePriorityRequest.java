package com.resolvenow.complaint.dto;

import com.resolvenow.complaint.entity.Priority;
import jakarta.validation.constraints.NotNull;

public class UpdatePriorityRequest {

    @NotNull(message = "Priority is required")
    private Priority priority;

    private String remarks;
    private String updatedBy;

    public UpdatePriorityRequest() {
    }

    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
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
