package com.example.jwtdemo.dto;

import java.time.Instant;

public class UserActivityDetailsDto {
    private String id;
    private String userId;
    private String projectId;
    private String action;
    private Instant timestamp;
    private String description;

    public UserActivityDetailsDto(String id, String userId, String projectId, String action, Instant timestamp, String description  ) {
        this.id = id;
        this.userId = userId;
        this.projectId = projectId;
        this.action = action;
        this.timestamp = timestamp;
        this.description = description;
    }

    public UserActivityDetailsDto() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}