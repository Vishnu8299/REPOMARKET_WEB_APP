package com.example.jwtdemo.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;
import java.util.List;

@Data
@Document(collection = "internships")
public class Internship {
    @Id
    private String id;
    private String buyerEmail;
    private String title;
    private String description;
    private String location;
    private String duration;
    private boolean paid;
    private Double stipend;
    private String companyName;
    private String qualifications;
    private List<String> skills;
    private Instant applicationDeadline;
    private String mode;
    private Instant postedAt;

    // Default constructor for deserialization
    public Internship() {}

    // Constructor from DTO
    public Internship(com.example.jwtdemo.dto.InternshipDto dto) {
        this.id = dto.getId();
        this.buyerEmail = dto.getBuyerEmail();
        this.title = dto.getTitle();
        this.description = dto.getDescription();
        this.location = dto.getLocation();
        this.duration = dto.getDuration();
        this.paid = dto.isPaid();
        this.stipend = dto.getStipend();
        this.companyName = dto.getCompanyName();
        this.qualifications = dto.getQualifications();
        this.skills = dto.getSkills();
        this.applicationDeadline = dto.getApplicationDeadline();
        this.mode = dto.getMode();
        this.postedAt = dto.getPostedAt();
    }

    // Convert to DTO
    public com.example.jwtdemo.dto.InternshipDto toDto() {
        com.example.jwtdemo.dto.InternshipDto dto = new com.example.jwtdemo.dto.InternshipDto();
        dto.setId(this.id);
        dto.setBuyerEmail(this.buyerEmail);
        dto.setTitle(this.title);
        dto.setDescription(this.description);
        dto.setLocation(this.location);
        dto.setDuration(this.duration);
        dto.setPaid(this.paid);
        dto.setStipend(this.stipend);
        dto.setCompanyName(this.companyName);
        dto.setQualifications(this.qualifications);
        dto.setSkills(this.skills);
        dto.setApplicationDeadline(this.applicationDeadline);
        dto.setMode(this.mode);
        dto.setPostedAt(this.postedAt);
        return dto;
    }
}
