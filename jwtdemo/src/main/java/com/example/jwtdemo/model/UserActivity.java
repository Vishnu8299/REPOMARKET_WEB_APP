package com.example.jwtdemo.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Document(collection = "user_activities")
public class UserActivity {
    @Id
    private String id;
    private String userId;
    private String projectId;
    private String action; // e.g. "CREATED_PROJECT", "EDITED_PROJECT", "UPLOADED_FILE", "COMMENTED"
    private String description;
    private LocalDateTime timestamp;
    // Optionally, add fields for commentId, fileName, etc.
}
