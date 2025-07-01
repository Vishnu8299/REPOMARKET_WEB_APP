package com.example.jwtdemo.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    @Value("${adzuna.app_id}")
    private String adzunaAppId;

    @Value("${adzuna.app_key}")
    private String adzunaAppKey;

    private final WebClient webClient = WebClient.create();

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
}
