package com.resolvenow.notification.dto;

public class UpdateNotificationRequest {

    private String title;
    private String message;
    private Boolean isRead;

    public UpdateNotificationRequest() {
    }

    public UpdateNotificationRequest(String title, String message, Boolean isRead) {
        this.title = title;
        this.message = message;
        this.isRead = isRead;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Boolean getIsRead() {
        return isRead;
    }

    public void setIsRead(Boolean isRead) {
        this.isRead = isRead;
    }
}
