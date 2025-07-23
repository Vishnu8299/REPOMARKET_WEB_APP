package com.example.jwtdemo.service;

import com.example.jwtdemo.dto.JobDto;
import com.example.jwtdemo.dto.InternshipDto;
import com.example.jwtdemo.dto.ProblemDto;
import reactor.core.publisher.Mono;
import java.util.List;

public interface JobService {
    Mono<JobDto> createJob(JobDto jobDto, String buyerEmail);
    Mono<InternshipDto> createInternship(InternshipDto internshipDto, String buyerEmail);
    Mono<ProblemDto> createProblem(ProblemDto problemDto, String buyerEmail);
    Mono<List<Object>> getPostsByBuyer(String buyerEmail);
    Mono<Void> deletePostByBuyer(String postId, String buyerEmail);
}
