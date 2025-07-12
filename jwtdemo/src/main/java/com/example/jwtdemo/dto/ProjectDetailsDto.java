package com.example.jwtdemo.dto;

import com.example.jwtdemo.model.Project;
import com.example.jwtdemo.model.User;
import java.util.List;
import java.util.Map;

public class ProjectDetailsDto {
    private String id;
    private String name;
    private String description;
    private String visibility;
    private boolean addReadme;
    private String gitignoreTemplate;
    private String license;
    private String[] technologies;
    private String status;
    private String createdAt;
    private String updatedAt;
    
    // Developer information
    private String developerName;
    private String developerEmail;
    private String developerOrganization;
    private String developerDescription;
    
    // Files information
    private List<ProjectFileDto> files;
    
    // Statistics
    private Map<String, Object> stats;
    
    // README content (if available)
    private String readmeContent;
    
    public static class ProjectFileDto {
        private String filename;
        private String contentType;
        private long size;
        private String downloadUrl;
        
        // Getters and Setters
        public String getFilename() { return filename; }
        public void setFilename(String filename) { this.filename = filename; }
        
        public String getContentType() { return contentType; }
        public void setContentType(String contentType) { this.contentType = contentType; }
        
        public long getSize() { return size; }
        public void setSize(long size) { this.size = size; }
        
        public String getDownloadUrl() { return downloadUrl; }
        public void setDownloadUrl(String downloadUrl) { this.downloadUrl = downloadUrl; }
    }
    
    // Constructor to build from Project and User
    public ProjectDetailsDto(Project project, User developer) {
        this.id = project.getId();
        this.name = project.getName();
        this.description = project.getDescription();
        this.visibility = project.getVisibility();
        this.addReadme = project.isAddReadme();
        this.gitignoreTemplate = project.getGitignoreTemplate();
        this.license = project.getLicense();
        this.technologies = project.getTechnologies();
        this.status = project.getStatus() != null ? project.getStatus().toString() : null;
        this.createdAt = project.getCreatedAt();
        this.updatedAt = project.getUpdatedAt();
        
        // Developer information
        if (developer != null) {
            this.developerName = developer.getName();
            this.developerEmail = developer.getEmail();
            this.developerOrganization = developer.getOrganization();
            this.developerDescription = developer.getDescription();
        }
        
        // Convert files to DTOs
        if (project.getFiles() != null) {
            this.files = project.getFiles().stream()
                .map(file -> {
                    ProjectFileDto fileDto = new ProjectFileDto();
                    fileDto.setFilename(file.getFilename());
                    fileDto.setContentType(file.getContentType());
                    fileDto.setSize(file.getSize());
                    fileDto.setDownloadUrl("/api/projects/public/" + project.getId() + "/files/" + file.getFilename() + "/download");
                    return fileDto;
                })
                .toList();
        }
        
        // Extract README content if available
        if (project.getFiles() != null) {
            project.getFiles().stream()
                .filter(file -> file.getFilename().toLowerCase().contains("readme"))
                .findFirst()
                .ifPresent(readmeFile -> {
                    if (readmeFile.getData() != null) {
                        this.readmeContent = new String(readmeFile.getData());
                    }
                });
        }
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getVisibility() { return visibility; }
    public void setVisibility(String visibility) { this.visibility = visibility; }
    
    public boolean isAddReadme() { return addReadme; }
    public void setAddReadme(boolean addReadme) { this.addReadme = addReadme; }
    
    public String getGitignoreTemplate() { return gitignoreTemplate; }
    public void setGitignoreTemplate(String gitignoreTemplate) { this.gitignoreTemplate = gitignoreTemplate; }
    
    public String getLicense() { return license; }
    public void setLicense(String license) { this.license = license; }
    
    public String[] getTechnologies() { return technologies; }
    public void setTechnologies(String[] technologies) { this.technologies = technologies; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
    
    public String getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }
    
    public String getDeveloperName() { return developerName; }
    public void setDeveloperName(String developerName) { this.developerName = developerName; }
    
    public String getDeveloperEmail() { return developerEmail; }
    public void setDeveloperEmail(String developerEmail) { this.developerEmail = developerEmail; }
    
    public String getDeveloperOrganization() { return developerOrganization; }
    public void setDeveloperOrganization(String developerOrganization) { this.developerOrganization = developerOrganization; }
    
    public String getDeveloperDescription() { return developerDescription; }
    public void setDeveloperDescription(String developerDescription) { this.developerDescription = developerDescription; }
    
    public List<ProjectFileDto> getFiles() { return files; }
    public void setFiles(List<ProjectFileDto> files) { this.files = files; }
    
    public Map<String, Object> getStats() { return stats; }
    public void setStats(Map<String, Object> stats) { this.stats = stats; }
    
    public String getReadmeContent() { return readmeContent; }
    public void setReadmeContent(String readmeContent) { this.readmeContent = readmeContent; }
} 