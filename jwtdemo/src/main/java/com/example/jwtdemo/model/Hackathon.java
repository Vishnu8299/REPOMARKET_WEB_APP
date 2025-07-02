package com.example.jwtdemo.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.util.List;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

@Data
@Document(collection = "hackathons")
public class Hackathon {
    @Id
    private String id;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Start date is required")
    private String startDate;

    @NotBlank(message = "End date is required")
    private String endDate;

   
    private String organizerId;

    
    private List<String> participants;

    
    private int maxParticipants;

    @Size(min = 1, message = "At least one prize must be specified")
    private String[] prizes;

    @NotNull(message = "Status is required")
    private HackathonStatus status;

    @Size(min = 1, message = "At least one technology must be specified")
    private String[] technologies;

    private String createdAt;
}

enum HackathonStatus {
    UPCOMING,
    ONGOING,
    COMPLETED
}
