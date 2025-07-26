package com.example.jwtdemo.repository;

import com.example.jwtdemo.model.Problem;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import reactor.core.publisher.Flux;

public interface ProblemRepository extends ReactiveMongoRepository<Problem, String> {
    Flux<Problem> findByBuyerEmail(String buyerEmail);
}
