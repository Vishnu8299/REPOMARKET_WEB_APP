package com.example.jwtdemo.service;

import com.example.jwtdemo.model.UserActivity;
import com.example.jwtdemo.repository.UserActivityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;

@Service
public class UserActivityService {

    @Autowired
    private UserActivityRepository userActivityRepository;

    public Mono<UserActivity> logActivity(String userId, String projectId, String action, String description) {
        UserActivity activity = new UserActivity();
        activity.setUserId(userId);
        activity.setProjectId(projectId);
        activity.setAction(action);
        activity.setDescription(description);
        activity.setTimestamp(LocalDateTime.now());
        return userActivityRepository.save(activity);
    }

    public Mono<UserActivity> logFileUpload(String userId, String projectId, String fileName) {
        return logActivity(userId, projectId, "UPLOADED_FILE", "Uploaded file: " + fileName);
    }

    public Mono<UserActivity> logComment(String userId, String projectId, String comment) {
        return logActivity(userId, projectId, "COMMENTED", "Commented: " + comment);
    }

    public Flux<UserActivity> getRecentActivitiesForUser(String userId) {
        return userActivityRepository.findByUserIdOrderByTimestampDesc(userId);
    }

    public Flux<UserActivity> getRecentActivitiesForProject(String projectId) {
        return userActivityRepository.findByProjectIdOrderByTimestampDesc(projectId);
    }

    public Flux<UserActivity> getActivitiesByProjectAndAction(String projectId, String action) {
        return userActivityRepository.findByProjectIdOrderByTimestampDesc(projectId)
            .filter(activity -> activity.getAction().equalsIgnoreCase(action));
    }

    public Flux<UserActivity> getActivitiesByUserAndAction(String userId, String action) {
        return userActivityRepository.findByUserIdOrderByTimestampDesc(userId)
            .filter(activity -> activity.getAction().equalsIgnoreCase(action));
    }

    public Flux<UserActivity> getActivityStreaks(String userId) {
        // Example: return all activities, frontend can calculate streaks
        return userActivityRepository.findByUserIdOrderByTimestampDesc(userId);
    }

    public Object getRecentActivities() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getRecentActivities'");
    }
}
