package com.example.jwtdemo.repository;

import com.example.jwtdemo.model.UserActivity;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;

public interface UserActivityRepository extends ReactiveCrudRepository<UserActivity, String> {
    Flux<UserActivity> findByUserIdOrderByTimestampDesc(String userId);
    Flux<UserActivity> findByProjectIdOrderByTimestampDesc(String projectId);
}
