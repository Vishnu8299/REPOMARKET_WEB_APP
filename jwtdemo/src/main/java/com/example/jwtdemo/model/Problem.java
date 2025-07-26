package com.example.jwtdemo.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;
import java.util.List;

@Data
@Document(collection = "problems")
public class Problem {
    @Id
    private String id;
    private String buyerEmail;
    private String title;
    private String statement;
    private String background;
    private String organization;
    private String domain;
    private String difficulty;
    private List<String> tags;
    private Instant postedAt;

    public Problem() {}

    public Problem(com.example.jwtdemo.dto.ProblemDto dto) {
        this.id = dto.getId();
        this.buyerEmail = dto.getBuyerEmail();
        this.title = dto.getTitle();
        this.statement = dto.getStatement();
        this.background = dto.getBackground();
        this.organization = dto.getOrganization();
        this.domain = dto.getDomain();
        this.difficulty = dto.getDifficulty();
        this.tags = dto.getTags();
        this.postedAt = dto.getPostedAt();
    }

    public com.example.jwtdemo.dto.ProblemDto toDto() {
        com.example.jwtdemo.dto.ProblemDto dto = new com.example.jwtdemo.dto.ProblemDto();
        dto.setId(this.id);
        dto.setBuyerEmail(this.buyerEmail);
        dto.setTitle(this.title);
        dto.setStatement(this.statement);
        dto.setBackground(this.background);
        dto.setOrganization(this.organization);
        dto.setDomain(this.domain);
        dto.setDifficulty(this.difficulty);
        dto.setTags(this.tags);
        dto.setPostedAt(this.postedAt);
        return dto;
    }
}
