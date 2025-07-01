package com.example.jwtdemo.controller;

import com.example.jwtdemo.model.UserActivity;
import com.example.jwtdemo.service.UserActivityService;
import com.example.jwtdemo.dto.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/activities")
public class UserActivityController {

    @Autowired
    private UserActivityService userActivityService;

    @GetMapping("/user/{userId}")
    public Mono<ApiResponse<Flux<UserActivity>>> getUserActivities(@PathVariable String userId) {
        return Mono.just(ApiResponse.success(userActivityService.getRecentActivitiesForUser(userId), "User activities fetched"));
    }

    @GetMapping("/project/{projectId}")
    public Mono<ApiResponse<Flux<UserActivity>>> getProjectActivities(@PathVariable String projectId) {
        return Mono.just(ApiResponse.success(userActivityService.getRecentActivitiesForProject(projectId), "Project activities fetched"));
    }

    @GetMapping("/project/{projectId}/action/{action}")
    public Mono<ApiResponse<Flux<UserActivity>>> getProjectActivitiesByAction(
            @PathVariable String projectId,
            @PathVariable String action) {
        return Mono.just(ApiResponse.success(
            userActivityService.getActivitiesByProjectAndAction(projectId, action),
            "Project activities by action fetched"
        ));
    }

    @GetMapping("/user/{userId}/action/{action}")
    public Mono<ApiResponse<Flux<UserActivity>>> getUserActivitiesByAction(
            @PathVariable String userId,
            @PathVariable String action) {
        return Mono.just(ApiResponse.success(
            userActivityService.getActivitiesByUserAndAction(userId, action),
            "User activities by action fetched"
        ));
    }

    @GetMapping("/user/{userId}/streaks")
    public Mono<ApiResponse<Flux<UserActivity>>> getUserActivityStreaks(
            @PathVariable String userId) {
        return Mono.just(ApiResponse.success(
            userActivityService.getActivityStreaks(userId),
            "User activity streaks fetched"
        ));
    }
}
