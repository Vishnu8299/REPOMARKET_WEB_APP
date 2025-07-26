package com.example.jwtdemo.repository;

import com.example.jwtdemo.model.Internship;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import reactor.core.publisher.Flux;

public interface InternshipRepository extends ReactiveMongoRepository<Internship, String> {
    Flux<Internship> findByBuyerEmail(String buyerEmail);
}
