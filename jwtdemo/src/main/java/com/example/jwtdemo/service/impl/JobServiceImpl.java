package com.example.jwtdemo.service.impl;

import com.example.jwtdemo.dto.JobDto;
import com.example.jwtdemo.dto.InternshipDto;
import com.example.jwtdemo.dto.ProblemDto;
import com.example.jwtdemo.model.Job;
import com.example.jwtdemo.model.Internship;
import com.example.jwtdemo.model.Problem;
import com.example.jwtdemo.repository.JobRepository;
import com.example.jwtdemo.repository.InternshipRepository;
import com.example.jwtdemo.repository.ProblemRepository;
import com.example.jwtdemo.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JobServiceImpl implements JobService {

    private final JobRepository jobRepository;
    private final InternshipRepository internshipRepository;
    private final ProblemRepository problemRepository;

    @Override
    public Mono<JobDto> createJob(JobDto jobDto, String buyerEmail) {
        jobDto.setBuyerEmail(buyerEmail);
        Job job = new Job(jobDto);
        return jobRepository.save(job)
                .map(Job::toDto);
    }

    @Override
    public Mono<InternshipDto> createInternship(InternshipDto internshipDto, String buyerEmail) {
        internshipDto.setBuyerEmail(buyerEmail);
        Internship internship = new Internship(internshipDto);
        return internshipRepository.save(internship)
                .map(Internship::toDto);
    }

    @Override
    public Mono<ProblemDto> createProblem(ProblemDto problemDto, String buyerEmail) {
        problemDto.setBuyerEmail(buyerEmail);
        problemDto.setPostedAt(Instant.now());
        Problem problem = new Problem(problemDto);
        return problemRepository.save(problem)
                .map(Problem::toDto);
    }

    @Override
    public Mono<List<Object>> getPostsByBuyer(String buyerEmail) {
        // Get jobs
        Mono<List<Object>> jobs = jobRepository.findByBuyerEmail(buyerEmail)
                .map(Job::toDto)
                .map(job -> (Object) job)
                .collectList();
                
        // Get internships
        Mono<List<Object>> internships = internshipRepository.findByBuyerEmail(buyerEmail)
                .map(Internship::toDto)
                .map(internship -> (Object) internship)
                .collectList();
                
        // Get problems
        Mono<List<Object>> problems = problemRepository.findByBuyerEmail(buyerEmail)
                .map(Problem::toDto)
                .map(problem -> (Object) problem)
                .collectList();
                
        // Combine all lists
        return Mono.zip(jobs, internships, problems)
                .map(tuple -> {
                    List<Object> combined = tuple.getT1();
                    combined.addAll(tuple.getT2());
                    combined.addAll(tuple.getT3());
                    return combined;
                });
    }

    @Override
    public Mono<Void> deletePostByBuyer(String postId, String buyerEmail) {
        // First try to find and delete from jobs
        Mono<Boolean> jobDeleted = jobRepository.findById(postId)
                .filter(job -> job.getBuyerEmail().equals(buyerEmail))
                .flatMap(job -> jobRepository.deleteById(postId).thenReturn(true))
                .defaultIfEmpty(false);
                
        // If not found in jobs, try internships
        return jobDeleted.flatMap(deleted -> {
            if (deleted) {
                return Mono.empty();
            }
            // Try internships
            return internshipRepository.findById(postId)
                    .filter(internship -> internship.getBuyerEmail().equals(buyerEmail))
                    .flatMap(internship -> internshipRepository.deleteById(postId))
                    .then()
                    .switchIfEmpty(
                        // If not found in internships, try problems
                        problemRepository.findById(postId)
                                .filter(problem -> problem.getBuyerEmail().equals(buyerEmail))
                                .flatMap(problem -> problemRepository.deleteById(postId))
                                .then()
                    );
        });
    }
}
