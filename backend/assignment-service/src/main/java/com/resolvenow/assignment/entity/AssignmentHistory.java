package com.resolvenow.assignment.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "assignment_history", indexes = {
    @Index(name = "idx_assign_hist_complaint", columnList = "complaint_id")
})
public class AssignmentHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "complaint_id", nullable = false)
    private Long complaintId;

    @Column(name = "previous_department")
    private String previousDepartment;

    @Column(name = "new_department", nullable = false)
    private String newDepartment;

    @Column(name = "previous_agent_id")
    private Long previousAgentId;

    @Column(name = "new_agent_id")
    private Long newAgentId;

    @Column(name = "new_agent_name")
    private String newAgentName;

    @Column(nullable = false, length = 50)
    private String action;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @Column(name = "performed_by", nullable = false)
    private String performedBy;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    public AssignmentHistory() {
        this.timestamp = LocalDateTime.now();
    }

    public AssignmentHistory(Long complaintId, String previousDepartment, String newDepartment,
                             Long previousAgentId, Long newAgentId, String newAgentName,
                             String action, String remarks, String performedBy) {
        this.complaintId = complaintId;
        this.previousDepartment = previousDepartment;
        this.newDepartment = newDepartment;
        this.previousAgentId = previousAgentId;
        this.newAgentId = newAgentId;
        this.newAgentName = newAgentName;
        this.action = action;
        this.remarks = remarks;
        this.performedBy = performedBy;
        this.timestamp = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getComplaintId() {
        return complaintId;
    }

    public void setComplaintId(Long complaintId) {
        this.complaintId = complaintId;
    }

    public String getPreviousDepartment() {
        return previousDepartment;
    }

    public void setPreviousDepartment(String previousDepartment) {
        this.previousDepartment = previousDepartment;
    }

    public String getNewDepartment() {
        return newDepartment;
    }

    public void setNewDepartment(String newDepartment) {
        this.newDepartment = newDepartment;
    }

    public Long getPreviousAgentId() {
        return previousAgentId;
    }

    public void setPreviousAgentId(Long previousAgentId) {
        this.previousAgentId = previousAgentId;
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

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public String getPerformedBy() {
        return performedBy;
    }

    public void setPerformedBy(String performedBy) {
        this.performedBy = performedBy;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
