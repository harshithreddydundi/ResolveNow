package com.resolvenow.complaint.dto;

import com.resolvenow.complaint.entity.Category;
import com.resolvenow.complaint.entity.Priority;

public class UpdateComplaintRequest {

    private String title;
    private String description;
    private Category category;
    private Priority priority;
    private String department;

    public UpdateComplaintRequest() {
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

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }
}
