package com.example.jwtdemo.dto;

import lombok.Data;
import java.time.Instant;

@Data
public class JobDto {
    private String title;
    private String description;
    private String location;
    private String type; // e.g. Full-time, Part-time
    private Double salary;
    private Instant postedAt;
    // ...add more fields as needed...
}
