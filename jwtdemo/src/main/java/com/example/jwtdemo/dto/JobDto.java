package com.example.jwtdemo.dto;

import lombok.Data;
import java.time.Instant;

@Data
public class JobDto {
    private String id; // Add an id field for database storage
    private String buyerEmail; // Track who posted the job
    private String title;
    private String description;
    private String location;
    private String type; // e.g. Full-time, Part-time
    private Double salary;
    private Integer yearsOfExperience;
    private Instant postedAt;
}
