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
public class ProblemDto {
    private String id;
    private String buyerEmail;

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

    @NotBlank(message = "Problem title is required")
    @Size(min = 5, max = 150, message = "Title must be between 5 and 150 characters")
    private String title;

    @NotBlank(message = "Problem statement is required")
    @Size(min = 50, message = "Statement must be at least 50 characters long")
    private String statement;

    @NotBlank(message = "Background information is required")
    private String background;

    @NotBlank(message = "Organization or Ministry is required")
    private String organization;

    @NotBlank(message = "Domain is required")
    private String domain; // e.g., Healthcare, Education, Agriculture

    @NotBlank(message = "Difficulty level is required")
    @Pattern(regexp = "Easy|Medium|Hard", message = "Difficulty must be 'Easy', 'Medium' or 'Hard'")
    private String difficulty;

    @NotEmpty(message = "At least one tag is required")
    private List<@NotBlank(message = "Tag cannot be blank") String> tags;

    private Instant postedAt;

    // Getters and Setters for all fields
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getStatement() {
        return statement;
    }

    public void setStatement(String statement) {
        this.statement = statement;
    }

    public String getBackground() {
        return background;
    }

    public void setBackground(String background) {
        this.background = background;
    }

    public String getOrganization() {
        return organization;
    }

    public void setOrganization(String organization) {
        this.organization = organization;
    }

    public String getDomain() {
        return domain;
    }

    public void setDomain(String domain) {
        this.domain = domain;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public Instant getPostedAt() {
        return postedAt;
    }

    public void setPostedAt(Instant postedAt) {
        this.postedAt = postedAt;
    }
}
