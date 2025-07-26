package com.example.jwtdemo.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;

@Data
@Document(collection = "jobs")
public class Job {
    @Id
    private String id;
    private String buyerEmail;
    private String title;
    private String description;
    private String location;
    private String type;
    private Double salary;
    private Instant postedAt;
    
    // Default constructor for deserialization
    public Job() {}
    
    // Constructor from DTO
    public Job(com.example.jwtdemo.dto.JobDto dto) {
        this.id = dto.getId();
        this.buyerEmail = dto.getBuyerEmail();
        this.title = dto.getTitle();
        this.description = dto.getDescription();
        this.location = dto.getLocation();
        this.type = dto.getType();
        this.salary = dto.getSalary();
        this.postedAt = dto.getPostedAt();
    }
    
    // Convert to DTO
    public com.example.jwtdemo.dto.JobDto toDto() {
        com.example.jwtdemo.dto.JobDto dto = new com.example.jwtdemo.dto.JobDto();
        dto.setId(this.id);
        dto.setBuyerEmail(this.buyerEmail);
        dto.setTitle(this.title);
        dto.setDescription(this.description);
        dto.setLocation(this.location);
        dto.setType(this.type);
        dto.setSalary(this.salary);
        dto.setPostedAt(this.postedAt);
        return dto;
    }
}
