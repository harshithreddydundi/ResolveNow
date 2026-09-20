package com.resolvenow.assignment.dto;

public class AutoAssignRequest {

    private Long complaintId;
    private String department;
    private String priority;

    public AutoAssignRequest() {
    }

    public AutoAssignRequest(Long complaintId, String department, String priority) {
        this.complaintId = complaintId;
        this.department = department;
        this.priority = priority;
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

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }
}
