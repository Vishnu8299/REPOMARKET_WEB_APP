package com.example.jwtdemo.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.*;
import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InternshipDto {
    private String id;
    private String buyerEmail;
    
    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(min = 20, message = "Description must be at least 20 characters")
    private String description;

    @NotBlank(message = "Location is required")
    private String location;

    @NotBlank(message = "Duration is required (e.g., '3 months')")
    private String duration;

    private boolean paid;

    @PositiveOrZero(message = "Stipend must be 0 or a positive value")
    private Double stipend;

    private Instant postedAt; // Automatically set in controller

    @NotBlank(message = "Company name is required")
    private String companyName;

    @NotBlank(message = "Qualifications field is required")
    private String qualifications;

    @NotEmpty(message = "At least one skill is required")
    private List<@NotBlank(message = "Skill cannot be blank") String> skills;

    @Future(message = "Application deadline must be in the future")
    private Instant applicationDeadline;

    @NotBlank(message = "Mode must be either 'Remote' or 'In-Office'")
    @Pattern(regexp = "Remote|In-Office", message = "Mode must be 'Remote' or 'In-Office'")
    private String mode;
    
    // Add these methods to handle the ID and buyerEmail fields
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getBuyerEmail() {
        return buyerEmail;
    }
    
    public void setBuyerEmail(String buyerEmail) {
        this.buyerEmail = buyerEmail;
    }
}
