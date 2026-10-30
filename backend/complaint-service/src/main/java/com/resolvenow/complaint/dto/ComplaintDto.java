package com.resolvenow.complaint.dto;

import com.resolvenow.complaint.entity.Category;
import com.resolvenow.complaint.entity.Complaint;
import com.resolvenow.complaint.entity.Priority;
import com.resolvenow.complaint.entity.Status;

import java.time.LocalDateTime;

public class ComplaintDto {

    private Long id;
    private String ticketNumber;
    private String title;
    private String description;
    private Category category;
    private Priority priority;
    private Status status;
    private Long customerId;
    private String customerName;
    private String customerEmail;
    private String department;
    private Long assignedAgentId;
    private String assignedAgentName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;
    private LocalDateTime closedAt;
    private LocalDateTime estimatedResolutionAt;
    private String estimatedResolutionText;
    private String resolutionNotes;
    private String resolvedBy;

    public ComplaintDto() {
    }

    public static ComplaintDto fromEntity(Complaint c) {
        if (c == null) return null;
        ComplaintDto dto = new ComplaintDto();
        dto.setId(c.getId());
        dto.setTicketNumber(c.getTicketNumber());
        dto.setTitle(c.getTitle());
        dto.setDescription(c.getDescription());
        dto.setCategory(c.getCategory());
        dto.setPriority(c.getPriority());
        dto.setStatus(c.getStatus());
        dto.setCustomerId(c.getCustomerId());
        dto.setCustomerName(c.getCustomerName());
        dto.setCustomerEmail(c.getCustomerEmail());
        dto.setDepartment(c.getDepartment());
        dto.setAssignedAgentId(c.getAssignedAgentId());
        dto.setAssignedAgentName(c.getAssignedAgentName());
        dto.setCreatedAt(c.getCreatedAt());
        dto.setUpdatedAt(c.getUpdatedAt());
        dto.setResolvedAt(c.getResolvedAt());
        dto.setClosedAt(c.getClosedAt());
        dto.setEstimatedResolutionAt(c.getEstimatedResolutionAt());
        dto.setEstimatedResolutionText(c.getEstimatedResolutionText());
        dto.setResolutionNotes(c.getResolutionNotes());
        dto.setResolvedBy(c.getResolvedBy());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTicketNumber() {
        return ticketNumber;
    }

    public void setTicketNumber(String ticketNumber) {
        this.ticketNumber = ticketNumber;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public Long getAssignedAgentId() {
        return assignedAgentId;
    }

    public void setAssignedAgentId(Long assignedAgentId) {
        this.assignedAgentId = assignedAgentId;
    }

    public String getAssignedAgentName() {
        return assignedAgentName;
    }

    public void setAssignedAgentName(String assignedAgentName) {
        this.assignedAgentName = assignedAgentName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public LocalDateTime getResolvedAt() {
        return resolvedAt;
    }

    public void setResolvedAt(LocalDateTime resolvedAt) {
        this.resolvedAt = resolvedAt;
    }

    public LocalDateTime getClosedAt() {
        return closedAt;
    }

    public void setClosedAt(LocalDateTime closedAt) {
        this.closedAt = closedAt;
    }

    public LocalDateTime getEstimatedResolutionAt() {
        return estimatedResolutionAt;
    }

    public void setEstimatedResolutionAt(LocalDateTime estimatedResolutionAt) {
        this.estimatedResolutionAt = estimatedResolutionAt;
    }

    public String getEstimatedResolutionText() {
        return estimatedResolutionText;
    }

    public void setEstimatedResolutionText(String estimatedResolutionText) {
        this.estimatedResolutionText = estimatedResolutionText;
    }

    public String getResolutionNotes() {
        return resolutionNotes;
    }

    public void setResolutionNotes(String resolutionNotes) {
        this.resolutionNotes = resolutionNotes;
    }

    public String getResolvedBy() {
        return resolvedBy;
    }

    public void setResolvedBy(String resolvedBy) {
        this.resolvedBy = resolvedBy;
    }
}
