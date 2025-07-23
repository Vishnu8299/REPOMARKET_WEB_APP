package com.example.jwtdemo.dto;

import lombok.Data;
import java.time.Instant;

@Data
public class InternshipDto {
    private String title;
    private String description;
    private String location;
    private String duration;
    private boolean paid;
    private Instant postedAt;
    // ...add more fields as needed...
}
