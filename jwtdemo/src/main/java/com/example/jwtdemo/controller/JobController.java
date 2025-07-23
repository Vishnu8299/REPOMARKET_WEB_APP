package com.example.jwtdemo.controller;

import com.example.jwtdemo.dto.ApiResponse;
import com.example.jwtdemo.dto.JobDto;
import com.example.jwtdemo.dto.InternshipDto;
import com.example.jwtdemo.dto.ProblemDto;
import com.example.jwtdemo.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.client.RestTemplate;
import reactor.core.publisher.Mono;
import java.security.Principal;
import java.util.List;
import java.time.Instant;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    @Value("${adzuna.app_id}")
    private String adzunaAppId;

    @Value("${adzuna.app_key}")
    private String adzunaAppKey;

    private final WebClient webClient = WebClient.create();

    @Autowired
    private JobService jobService;

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public Mono<String> getJobs(
            @RequestParam(defaultValue = "in") String country,
            @RequestParam(defaultValue = "software") String what,
            @RequestParam(defaultValue = "1") int page) {

        String url = String.format(
            "https://api.adzuna.com/v1/api/jobs/%s/search/%d?app_id=%s&app_key=%s&what=%s",
            country, page, adzunaAppId, adzunaAppKey, what
        );

        return webClient.get()
                .uri(url)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(String.class);
    }

    // New endpoint for internships
    @GetMapping(value = "/internships", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getInternships(@RequestParam(value = "where", required = false) String where) {
        String baseUrl = "https://api.adzuna.com/v1/api/jobs/in/search/1";
        StringBuilder url = new StringBuilder(baseUrl)
            .append("?what=intern")
            .append("&app_id=").append(adzunaAppId)
            .append("&app_key=").append(adzunaAppKey);
        if (where != null && !where.isEmpty()) {
            url.append("&where=").append(where);
        }

        RestTemplate restTemplate = new RestTemplate();
        String response = restTemplate.getForObject(url.toString(), String.class);
        return ResponseEntity.ok(response);
    }

    // --- Post Job (BUYER only) ---
    @PostMapping("/post-job")
    @PreAuthorize("hasRole('BUYER')")
    public Mono<ResponseEntity<ApiResponse<JobDto>>> postJob(
            @RequestBody JobDto jobDto,
            Principal principal) {
        jobDto.setPostedAt(Instant.now());
        return jobService.createJob(jobDto, principal.getName())
                .map(savedJob -> ResponseEntity.status(HttpStatus.CREATED)
                        .body(ApiResponse.success(savedJob, "Job posted successfully")))
                .onErrorResume(ex -> Mono.just(ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("Failed to post job: " + ex.getMessage()))));
    }

    // --- Post Internship (BUYER only) ---
    @PostMapping("/post-internship")
    @PreAuthorize("hasRole('BUYER')")
    public Mono<ResponseEntity<ApiResponse<InternshipDto>>> postInternship(
            @RequestBody InternshipDto internshipDto,
            Principal principal) {
        internshipDto.setPostedAt(Instant.now());
        return jobService.createInternship(internshipDto, principal.getName())
                .map(savedInternship -> ResponseEntity.status(HttpStatus.CREATED)
                        .body(ApiResponse.success(savedInternship, "Internship posted successfully")))
                .onErrorResume(ex -> Mono.just(ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("Failed to post internship: " + ex.getMessage()))));
    }

    // --- Post Problem (BUYER only) ---
    @PostMapping("/post-problem")
    @PreAuthorize("hasRole('BUYER')")
    public Mono<ResponseEntity<ApiResponse<ProblemDto>>> postProblem(
            @RequestBody ProblemDto problemDto,
            Principal principal) {
        problemDto.setPostedAt(Instant.now());
        return jobService.createProblem(problemDto, principal.getName())
                .map(savedProblem -> ResponseEntity.status(HttpStatus.CREATED)
                        .body(ApiResponse.success(savedProblem, "Problem posted successfully")))
                .onErrorResume(ex -> Mono.just(ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("Failed to post problem: " + ex.getMessage()))));
    }

    // --- Manage Posts (BUYER only) ---
    @GetMapping("/manage-posts")
    @PreAuthorize("hasRole('BUYER')")
    public Mono<ResponseEntity<ApiResponse<List<Object>>>> managePosts(Principal principal) {
        return jobService.getPostsByBuyer(principal.getName())
                .map(posts -> ResponseEntity.ok(ApiResponse.success(posts, "Posts retrieved successfully")))
                .onErrorResume(ex -> Mono.just(ResponseEntity
                        .status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(ApiResponse.error("Failed to retrieve posts: " + ex.getMessage()))));
    }

    @DeleteMapping("/manage-posts/{postId}")
    @PreAuthorize("hasRole('BUYER')")
    public Mono<ResponseEntity<ApiResponse<Void>>> deletePost(
            @PathVariable String postId,
            Principal principal) {
        return jobService.deletePostByBuyer(postId, principal.getName())
                .then(Mono.just(ResponseEntity.ok(ApiResponse.<Void>success(null, "Post deleted successfully"))))
                .onErrorResume(ex -> Mono.just(ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("Failed to delete post: " + ex.getMessage()))));
    }
}
