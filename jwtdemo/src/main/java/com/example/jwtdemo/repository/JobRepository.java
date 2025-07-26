package com.example.jwtdemo.repository;

import com.example.jwtdemo.model.Job;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import reactor.core.publisher.Flux;

public interface JobRepository extends ReactiveMongoRepository<Job, String> {
    Flux<Job> findByBuyerEmail(String buyerEmail);
}
