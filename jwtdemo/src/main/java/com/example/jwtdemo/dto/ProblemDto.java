package com.example.jwtdemo.dto;

import lombok.Data;
import java.time.Instant;

@Data
public class ProblemDto {
    private String title;
    private String statement;
    private String tags;
    private Instant postedAt;
    // ...add more fields as needed...
}
