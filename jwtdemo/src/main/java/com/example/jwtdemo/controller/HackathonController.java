package com.example.jwtdemo.controller;

import com.example.jwtdemo.model.Hackathon;
import com.example.jwtdemo.service.HackathonService;
import com.example.jwtdemo.dto.ApiResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;

@RestController
@RequestMapping("/api/hackathons")
@Validated
public class HackathonController {
    private static final Logger logger = LoggerFactory.getLogger(HackathonController.class);

    @Autowired
    private HackathonService hackathonService;

    @PostMapping
@PreAuthorize("hasRole('BUYER')")
public Mono<ResponseEntity<ApiResponse<Hackathon>>> createHackathon(
        @Valid @RequestBody(required = false) Hackathon hackathon) {

    if (hackathon == null) {
        return Mono.just(ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error("Request body is missing or invalid")));
    }

    return ReactiveSecurityContextHolder.getContext()
            .map(securityContext -> (UserDetails) securityContext.getAuthentication().getPrincipal())
            .flatMap(userDetails -> {
                hackathon.setOrganizerId(userDetails.getUsername());

                logger.info("Creating hackathon: {} by organizer: {}", hackathon.getName(), hackathon.getOrganizerId());

                return hackathonService.createHackathon(hackathon)
                        .map(createdHackathon -> ResponseEntity
                                .status(HttpStatus.CREATED)
                                .body(ApiResponse.success(createdHackathon, "Hackathon created successfully"))
                        );
            })
            .onErrorResume(ex -> {
                HttpStatus status = ex instanceof IllegalArgumentException ?
                        HttpStatus.BAD_REQUEST : HttpStatus.INTERNAL_SERVER_ERROR;
                logger.error("Failed to create hackathon: {}", ex.getMessage(), ex);
                return Mono.just(ResponseEntity
                        .status(status)
                        .body(ApiResponse.error("Hackathon creation failed: " + ex.getMessage())));
            });
}


    @GetMapping
    public Mono<ResponseEntity<ApiResponse<java.util.List<Hackathon>>>> getAllHackathons() {
        logger.info("Retrieving all hackathons");
        return hackathonService.getAllHackathons()
            .collectList()
            .map(hackathons -> ResponseEntity.ok(
                ApiResponse.success(hackathons, "Hackathons retrieved successfully")
            ))
            .onErrorResume(ex -> {
                logger.error("Failed to retrieve hackathons", ex);
                return Mono.just(ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve hackathons: " + ex.getMessage())));
            });
    }

    @PostMapping("/{hackathonId}/register")
    @PreAuthorize("hasRole('DEVELOPER')")
    public Mono<ResponseEntity<ApiResponse<Void>>> registerParticipant(
            @PathVariable @NotBlank(message = "Hackathon ID cannot be blank") String hackathonId) {
        return ReactiveSecurityContextHolder.getContext()
            .map(securityContext -> {
                Object principal = securityContext.getAuthentication().getPrincipal();
                if (principal instanceof UserDetails) {
                    return ((UserDetails) principal).getUsername();
                } else if (principal instanceof String) {
                    return (String) principal;
                } else {
                    throw new IllegalArgumentException("Unable to extract username from principal");
                }
            })
            .flatMap(userId -> {
                logger.info("Registering participant {} for hackathon {}", userId, hackathonId);

                return hackathonService.registerParticipant(hackathonId, userId)
                        .thenReturn(ResponseEntity.ok(ApiResponse.<Void>success(null, "Participant registered successfully")));
            })
            .onErrorResume(ex -> {
                HttpStatus status = ex instanceof IllegalArgumentException ?
                    HttpStatus.BAD_REQUEST : HttpStatus.INTERNAL_SERVER_ERROR;
                logger.error("Failed to register participant", ex);
                return Mono.just(ResponseEntity
                    .status(status)
                    .body(ApiResponse.error("Participant registration failed: " + ex.getMessage())));
            });
    }
}