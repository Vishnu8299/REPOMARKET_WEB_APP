package com.example.jwtdemo.controller;

import com.example.jwtdemo.model.Project;
import com.example.jwtdemo.model.ProjectStatus;
import com.example.jwtdemo.service.ProjectService;
import com.example.jwtdemo.dto.ApiResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.security.core.Authentication;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;
import com.example.jwtdemo.dto.ProjectDetailsDto;
import com.example.jwtdemo.service.UserService;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {
    private static final Logger logger = LoggerFactory.getLogger(ProjectController.class);

    @Autowired
    private ProjectService projectService;
    
    @Autowired
    private UserService userService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('DEVELOPER')")
    public Mono<ResponseEntity<ApiResponse<Project>>> createProject(
            @RequestPart("name") String name,
            @RequestPart("description") String description,
            @RequestPart("visibility") String visibility,
            @RequestPart("addReadme") String addReadme,
            @RequestPart("gitignoreTemplate") String gitignoreTemplate,
            @RequestPart("license") String license,
            @RequestPart(value = "files", required = false) Flux<FilePart> files,
            Authentication authentication) {
        
        logger.info("Creating project with name: {} and user: {}", name, authentication.getName());
        
        Project project = new Project();
        project.setName(name);
        project.setDescription(description);
        project.setVisibility(visibility);
        project.setAddReadme(Boolean.parseBoolean(addReadme));
        project.setGitignoreTemplate(gitignoreTemplate);
        project.setLicense(license);
        project.setUserId(authentication.getName());
        project.setStatus(ProjectStatus.PUBLISHED);
        project.setFiles(new ArrayList<>());

        // Process files if any
        if (files != null) {
            logger.info("Processing files for project: {}", name);
            return files
                .flatMap(filePart -> {
                    logger.info("Processing file: {} of type: {}", 
                        filePart.filename(), 
                        filePart.headers().getContentType());
                    
                    return filePart.content()
                        .reduce(new byte[0], (acc, dataBuffer) -> {
                            byte[] data = new byte[dataBuffer.readableByteCount()];
                            dataBuffer.read(data);
                            byte[] result = new byte[acc.length + data.length];
                            System.arraycopy(acc, 0, result, 0, acc.length);
                            System.arraycopy(data, 0, result, acc.length, data.length);
                            return result;
                        })
                        .map(bytes -> {
                            Project.ProjectFile projectFile = new Project.ProjectFile();
                            projectFile.setFilename(filePart.filename());
                            projectFile.setContentType(Optional.ofNullable(filePart.headers().getContentType())
                                .map(Object::toString)
                                .orElse("application/octet-stream"));
                            projectFile.setData(bytes);
                            projectFile.setSize(bytes.length);
                            logger.info("File processed: {} (size: {} bytes)", 
                                filePart.filename(), bytes.length);
                            return projectFile;
                        });
                })
                .collectList()
                .flatMap(projectFiles -> {
                    project.setFiles(projectFiles);
                    logger.info("Saving project {} with {} files", name, projectFiles.size());
                    return projectService.createProject(project);
                })
                .map(createdProject -> {
                    logger.info("Project created successfully: {}", createdProject.getId());
                    return ResponseEntity.ok(
                        ApiResponse.success(createdProject, "Project created successfully")
                    );
                })
                .onErrorResume(ex -> {
                    logger.error("Failed to create project: {}", ex.getMessage(), ex);
                    return Mono.just(ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("Project creation failed: " + ex.getMessage())));
                });
        }

        // If no files, just create the project
        logger.info("Creating project without files: {}", name);
        return projectService.createProject(project)
                .map(createdProject -> {
                    logger.info("Project created successfully: {}", createdProject.getId());
                    return ResponseEntity.ok(
                        ApiResponse.success(createdProject, "Project created successfully")
                    );
                })
                .onErrorResume(ex -> {
                    logger.error("Failed to create project: {}", ex.getMessage(), ex);
                    return Mono.just(ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("Project creation failed: " + ex.getMessage())));
                });
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('DEVELOPER')")
    public Mono<ResponseEntity<ApiResponse<Project>>> updateProject(
            @PathVariable @NotBlank(message = "Project ID cannot be blank") String id, 
            @Valid @RequestBody Project project) {
        logger.info("Updating project: {}", id);
        logger.info("Incoming project object: {}", project); // Log the incoming project object
        return projectService.updateProject(id, project)
                .map(updatedProject -> ResponseEntity.ok(
                    ApiResponse.success(updatedProject, "Project updated successfully")
                ))
                .onErrorResume(ex -> {
                    logger.error("Failed to update project", ex); // Log stack trace
                    return Mono.just(ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("Project update failed: " + ex.getMessage())));
                });
    }

    @GetMapping
    public Mono<ResponseEntity<ApiResponse<List<Project>>>> getAllProjects() {
        logger.info("Retrieving all projects");
        return projectService.getAllProjects()
            .collectList()
            .map(projects -> ResponseEntity.ok(
                ApiResponse.success(projects, "Projects retrieved successfully")
            ))
            .onErrorResume(ex -> {
                logger.error("Failed to retrieve projects", ex);
                return Mono.just(ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve projects: " + ex.getMessage())));
            });
    }

    @GetMapping("/developer/{email}")
    @PreAuthorize("hasRole('DEVELOPER')")
    public Mono<ResponseEntity<ApiResponse<List<Project>>>> getDeveloperProjectsByEmail(
            @PathVariable @NotBlank(message = "Email cannot be blank") String email,
            Authentication authentication) {
        if (!email.equals(authentication.getName())) {
            return Mono.just(ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ApiResponse.error("You can only access your own projects")));
        }
        
        logger.info("Retrieving projects for developer email: {}", email);
        return projectService.getUserProjects(email)
            .collectList()
            .map(projects -> {
                logger.info("Found {} projects for developer {}", projects.size(), email);
                return ResponseEntity.ok(new ApiResponse<>(
                    projects,
                    "Developer projects retrieved successfully",
                    true,
                    200
                ));
            })
            .onErrorResume(ex -> {
                logger.error("Failed to retrieve developer projects", ex);
                return Mono.just(ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve developer projects: " + ex.getMessage())));
            });
    }

    @GetMapping("/search")
    public Mono<ResponseEntity<ApiResponse<Flux<Project>>>> searchProjects(
            @RequestParam(required = false) String[] technologies,
            @RequestParam(required = false) String status) {
        logger.info("Searching projects with technologies: {}, status: {}", technologies, status);
        return Mono.just(ResponseEntity.ok(
            ApiResponse.success(
                projectService.searchProjects(technologies, status), 
                "Projects searched successfully"
            )
        )).onErrorResume(ex -> {
            logger.error("Failed to search projects", ex);
            return Mono.just(ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error("Project search failed: " + ex.getMessage())));
        });
    }

@PostMapping("/{projectId}/purchase")
    @PreAuthorize("hasRole('BUYER')")
    public Mono<ResponseEntity<ApiResponse<String>>> purchaseProject(
            @PathVariable @NotBlank(message = "Project ID cannot be blank") String projectId,
            Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return Mono.just(ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error("User not authenticated")));
        }
        String buyerId = authentication.getName();
        logger.info("Purchasing project {} by buyer {}", projectId, buyerId);
        return projectService.purchaseProject(projectId, buyerId)
                .then(Mono.just(ResponseEntity.ok(
                    ApiResponse.success("Purchase completed", "Project purchased successfully")
                )))
                .onErrorResume(ex -> {
                    logger.error("Failed to purchase project", ex);
                    return Mono.just(ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("Project purchase failed: " + ex.getMessage())));
                });
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('DEVELOPER')")
    public Mono<ResponseEntity<ApiResponse<Project>>> getProjectById(
            @PathVariable @NotBlank(message = "Project ID cannot be blank") String id,
            Authentication authentication) {
        logger.info("Retrieving project with ID: {} for user: {}", id, authentication.getName());

        if (id == null || id.trim().isEmpty()) {
            return Mono.just(ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.<Project>error("Project ID is required")));
        }

        // Limit the size of the files returned (avoid exceeding buffer)
        return projectService.getProjectById(id)
            .flatMap(project -> {
                if (!project.getUserId().equals(authentication.getName())) {
                    return Mono.just(ResponseEntity
                        .status(HttpStatus.FORBIDDEN)
                        .body(ApiResponse.<Project>error("You can only access your own projects")));
                }
                // Limit each file's data to 256KB (262144 bytes)
                if (project.getFiles() != null) {
                    project.getFiles().forEach(file -> {
                        if (file.getData() != null && file.getData().length > 262144) {
                            file.setData(null); // or truncate, or set a flag
                        }
                    });
                }
                logger.info("Project found: {}", project.getId());
                return Mono.just(ResponseEntity.ok(ApiResponse.success(project, "Project retrieved successfully")));
            })
            .defaultIfEmpty(ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.<Project>error("Project not found")))
            .onErrorResume(ex -> {
                logger.error("Failed to retrieve project: {}", ex.getMessage());
                return Mono.just(ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.<Project>error("Failed to retrieve project: " + ex.getMessage())));
            });
    }

    // New public endpoint for buyers to fetch project details (including all file types)
    @GetMapping("/public/{id}")
    public Mono<ResponseEntity<ApiResponse<Project>>> getProjectByIdPublic(
            @PathVariable @NotBlank(message = "Project ID cannot be blank") String id) {
        logger.info("[PUBLIC] Retrieving project with ID: {}", id);

        if (id == null || id.trim().isEmpty()) {
            return Mono.just(ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.<Project>error("Project ID is required")));
        }

        // No authentication or role check, return all files as-is
        return projectService.getProjectById(id)
            .map(project -> {
                logger.info("[PUBLIC] Project found: {}", project.getId());
                return ResponseEntity.ok(ApiResponse.success(project, "Project retrieved successfully"));
            })
            .defaultIfEmpty(ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.<Project>error("Project not found")))
            .onErrorResume(ex -> {
                logger.error("[PUBLIC] Failed to retrieve project: {}", ex.getMessage());
                return Mono.just(ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.<Project>error("Failed to retrieve project: " + ex.getMessage())));
            });
    }

    // Enhanced public endpoint for comprehensive project details including developer info
    @GetMapping("/public/{id}/details")
    public Mono<ResponseEntity<ApiResponse<ProjectDetailsDto>>> getProjectDetails(
            @PathVariable @NotBlank(message = "Project ID cannot be blank") String id) {
        logger.info("[PUBLIC] Retrieving comprehensive project details for ID: {}", id);

        if (id == null || id.trim().isEmpty()) {
            return Mono.just(ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.<ProjectDetailsDto>error("Project ID is required")));
        }

        return projectService.getProjectById(id)
            .flatMap(project -> {
                logger.info("[PUBLIC] Project found: {}", project.getId());
                
                // Fetch developer information
                return userService.findByEmail(project.getUserId())
                    .map(developer -> {
                        ProjectDetailsDto detailsDto = new ProjectDetailsDto(project, developer);
                        
                        // Add basic stats
                        Map<String, Object> stats = new HashMap<>();
                        stats.put("projectId", project.getId());
                        stats.put("viewCount", 0); // TODO: Implement view tracking
                        stats.put("downloadCount", 0); // TODO: Implement download tracking
                        stats.put("rating", 0.0); // TODO: Implement rating system
                        stats.put("reviewCount", 0); // TODO: Implement review system
                        detailsDto.setStats(stats);
                        
                        return ResponseEntity.ok(ApiResponse.success(detailsDto, "Project details retrieved successfully"));
                    })
                    .defaultIfEmpty(ResponseEntity.ok(ApiResponse.success(
                        new ProjectDetailsDto(project, null), 
                        "Project details retrieved successfully (developer info not found)"
                    )));
            })
            .defaultIfEmpty(ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.<ProjectDetailsDto>error("Project not found")))
            .onErrorResume(ex -> {
                logger.error("[PUBLIC] Failed to retrieve project details: {}", ex.getMessage());
                return Mono.just(ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.<ProjectDetailsDto>error("Failed to retrieve project details: " + ex.getMessage())));
            });
    }

    // Get project statistics for details page
    @GetMapping("/public/{id}/stats")
    public Mono<ResponseEntity<ApiResponse<Map<String, Object>>>> getProjectStats(
            @PathVariable @NotBlank(message = "Project ID cannot be blank") String id) {
        logger.info("[PUBLIC] Retrieving project stats for ID: {}", id);
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("projectId", id);
        stats.put("viewCount", 0); // TODO: Implement view tracking
        stats.put("downloadCount", 0); // TODO: Implement download tracking
        stats.put("rating", 0.0); // TODO: Implement rating system
        stats.put("reviewCount", 0); // TODO: Implement review system
        
        return Mono.just(ResponseEntity.ok(
            ApiResponse.success(stats, "Project statistics retrieved successfully")
        ));
    }

    // Track project view (for analytics)
    @PostMapping("/public/{id}/view")
    public Mono<ResponseEntity<ApiResponse<String>>> trackProjectView(
            @PathVariable @NotBlank(message = "Project ID cannot be blank") String id) {
        logger.info("[PUBLIC] Tracking view for project ID: {}", id);
        
        // TODO: Implement view tracking logic
        // This could increment a view counter in the database
        
        return Mono.just(ResponseEntity.ok(
            ApiResponse.success("View tracked successfully", "Project view tracked")
        ));
    }

    // Download file from project
    @GetMapping("/public/{projectId}/files/{filename}/download")
    public Mono<ResponseEntity<byte[]>> downloadProjectFile(
            @PathVariable @NotBlank(message = "Project ID cannot be blank") String projectId,
            @PathVariable @NotBlank(message = "Filename cannot be blank") String filename) {
        logger.info("[PUBLIC] Downloading file {} from project {}", filename, projectId);
        
        return projectService.getProjectById(projectId)
            .flatMap(project -> {
                if (project.getFiles() == null) {
                    return Mono.empty();
                }
                
                return project.getFiles().stream()
                    .filter(file -> file.getFilename().equals(filename))
                    .findFirst()
                    .map(file -> {
                        // TODO: Implement download tracking
                        return ResponseEntity.ok()
                            .header("Content-Disposition", "attachment; filename=\"" + filename + "\"")
                            .header("Content-Type", file.getContentType())
                            .body(file.getData());
                    })
                    .map(Mono::just)
                    .orElse(Mono.empty());
            })
            .defaultIfEmpty(ResponseEntity.notFound().build())
            .onErrorResume(ex -> {
                logger.error("[PUBLIC] Failed to download file: {}", ex.getMessage());
                return Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build());
            });
    }
}
