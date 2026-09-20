package com.resolvenow.assignment.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "assignments", indexes = {
    @Index(name = "idx_assign_complaint_id", columnList = "complaint_id"),
    @Index(name = "idx_assign_agent_id", columnList = "agent_id"),
    @Index(name = "idx_assign_dept", columnList = "department"),
    @Index(name = "idx_assign_status", columnList = "status")
})
public class Assignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "complaint_id", nullable = false)
    private Long complaintId;

    @Column(nullable = false)
    private String department;

    @Column(name = "agent_id")
    private Long agentId;

    @Column(name = "agent_name")
    private String agentName;

    @Column(name = "assigned_by", nullable = false)
    private String assignedBy;

    @Column(name = "assigned_at", nullable = false)
    private LocalDateTime assignedAt;

    @Column(nullable = false, length = 50)
    private String status = "ASSIGNED";

    @Column(columnDefinition = "TEXT")
    private String remarks;

    public Assignment() {
        this.assignedAt = LocalDateTime.now();
    }

    public Assignment(Long complaintId, String department, Long agentId, String agentName, String assignedBy, String status, String remarks) {
        this.complaintId = complaintId;
        this.department = department;
        this.agentId = agentId;
        this.agentName = agentName;
        this.assignedBy = assignedBy;
        this.status = status != null ? status : "ASSIGNED";
        this.remarks = remarks;
        this.assignedAt = LocalDateTime.now();
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

    public String getAssignedBy() {
        return assignedBy;
    }

    public void setAssignedBy(String assignedBy) {
        this.assignedBy = assignedBy;
    }

    public LocalDateTime getAssignedAt() {
        return assignedAt;
    }

    public void setAssignedAt(LocalDateTime assignedAt) {
        this.assignedAt = assignedAt;
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
}
