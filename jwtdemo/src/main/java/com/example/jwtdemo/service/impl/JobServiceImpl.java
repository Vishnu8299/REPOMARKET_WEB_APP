package com.example.jwtdemo.service.impl;

import com.example.jwtdemo.dto.JobDto;
import com.example.jwtdemo.dto.InternshipDto;
import com.example.jwtdemo.dto.ProblemDto;
import com.example.jwtdemo.service.JobService;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import java.util.List;
import java.util.Collections;

@Service
public class JobServiceImpl implements JobService {
    @Override
    public Mono<JobDto> createJob(JobDto jobDto, String buyerEmail) {
        // TODO: Implement actual persistence logic
        return Mono.just(jobDto);
    }

    @Override
    public Mono<InternshipDto> createInternship(InternshipDto internshipDto, String buyerEmail) {
        // TODO: Implement actual persistence logic
        return Mono.just(internshipDto);
    }

    @Override
    public Mono<ProblemDto> createProblem(ProblemDto problemDto, String buyerEmail) {
        // TODO: Implement actual persistence logic
        return Mono.just(problemDto);
    }

    @Override
    public Mono<List<Object>> getPostsByBuyer(String buyerEmail) {
        // TODO: Implement actual retrieval logic
        return Mono.just(Collections.emptyList());
    }

    @Override
    public Mono<Void> deletePostByBuyer(String postId, String buyerEmail) {
        // TODO: Implement actual delete logic
        return Mono.empty();
    }
}
