package com.example.jwtdemo.service.impl;

import com.example.jwtdemo.dto.JobDto;
import com.example.jwtdemo.dto.InternshipDto;
import com.example.jwtdemo.dto.ProblemDto;
import com.example.jwtdemo.model.Job;
import com.example.jwtdemo.repository.JobRepository;
import com.example.jwtdemo.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobServiceImpl implements JobService {

    private final JobRepository jobRepository;

    @Override
    public Mono<JobDto> createJob(JobDto jobDto, String buyerEmail) {
        jobDto.setBuyerEmail(buyerEmail);
        Job job = new Job(jobDto);
        return jobRepository.save(job)
                .map(Job::toDto);
    }

    @Override
    public Mono<InternshipDto> createInternship(InternshipDto internshipDto, String buyerEmail) {
        // TODO: Implement actual persistence logic for internships
        return Mono.just(internshipDto);
    }

    @Override
    public Mono<ProblemDto> createProblem(ProblemDto problemDto, String buyerEmail) {
        // TODO: Implement actual persistence logic for problems
        return Mono.just(problemDto);
    }

    @Override
    public Mono<List<Object>> getPostsByBuyer(String buyerEmail) {
        return jobRepository.findByBuyerEmail(buyerEmail)
                .map(Job::toDto)
                .collect(Collectors.toList())
                .map(jobs -> jobs.stream()
                        .map(job -> (Object) job)
                        .collect(Collectors.toList()));
    }

    @Override
    public Mono<Void> deletePostByBuyer(String postId, String buyerEmail) {
        return jobRepository.findById(postId)
                .filter(job -> job.getBuyerEmail().equals(buyerEmail))
                .flatMap(job -> jobRepository.deleteById(postId))
                .then();
    }
}
