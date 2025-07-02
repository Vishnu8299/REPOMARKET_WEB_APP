package com.example.jwtdemo.controller;

import com.example.jwtdemo.model.UserActivity;
import com.example.jwtdemo.service.UserActivityService;
import com.example.jwtdemo.dto.ApiResponse;
import com.example.jwtdemo.dto.UserActivityDetailsDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/activities")
public class UserActivityController {

    @Autowired
    private UserActivityService userActivityService;

    private UserActivityDetailsDto toDetailsDto(UserActivity activity) {
        // Map fields as needed for UI
        UserActivityDetailsDto dto = new UserActivityDetailsDto();
        dto.setId(activity.getId());
        dto.setUserId(activity.getUserId());
        dto.setProjectId(activity.getProjectId());
        dto.setAction(activity.getAction());
        dto.setTimestamp(activity.getTimestamp().atZone(java.time.ZoneId.systemDefault()).toInstant());
        dto.setDescription(activity.getDescription());
        return dto;
    }

    @GetMapping("/user/{userId}")
    public Mono<ApiResponse<Flux<UserActivityDetailsDto>>> getUserActivities(@PathVariable String userId) {
        Flux<UserActivityDetailsDto> detailsFlux = userActivityService.getRecentActivitiesForUser(userId)
            .map(this::toDetailsDto);
        return Mono.just(ApiResponse.success(detailsFlux, "User activities fetched"));
    }

    @GetMapping("/project/{projectId}")
    public Mono<ApiResponse<Flux<UserActivityDetailsDto>>> getProjectActivities(@PathVariable String projectId) {
        Flux<UserActivityDetailsDto> detailsFlux = userActivityService.getRecentActivitiesForProject(projectId)
            .map(this::toDetailsDto);
        return Mono.just(ApiResponse.success(detailsFlux, "Project activities fetched"));
    }

    @GetMapping("/project/{projectId}/action/{action}")
    public Mono<ApiResponse<Flux<UserActivityDetailsDto>>> getProjectActivitiesByAction(
            @PathVariable String projectId,
            @PathVariable String action) {
        Flux<UserActivityDetailsDto> detailsFlux = userActivityService.getActivitiesByProjectAndAction(projectId, action)
            .map(this::toDetailsDto);
        return Mono.just(ApiResponse.success(
            detailsFlux,
            "Project activities by action fetched"
        ));
    }

    @GetMapping("/user/{userId}/action/{action}")
    public Mono<ApiResponse<Flux<UserActivityDetailsDto>>> getUserActivitiesByAction(
            @PathVariable String userId,
            @PathVariable String action) {
        Flux<UserActivityDetailsDto> detailsFlux = userActivityService.getActivitiesByUserAndAction(userId, action)
            .map(this::toDetailsDto);
        return Mono.just(ApiResponse.success(
            detailsFlux,
            "User activities by action fetched"
        ));
    }

    @GetMapping("/user/{userId}/streaks")
    public Mono<ApiResponse<Flux<UserActivityDetailsDto>>> getUserActivityStreaks(
            @PathVariable String userId) {
        Flux<UserActivityDetailsDto> detailsFlux = userActivityService.getActivityStreaks(userId)
            .map(this::toDetailsDto);
        return Mono.just(ApiResponse.success(
            detailsFlux,
            "User activity streaks fetched"
        ));
    }
}
