package com.example.jwtdemo.service;

import com.example.jwtdemo.model.Hackathon;
import com.example.jwtdemo.repository.HackathonRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.ArrayList;

@Service
@Validated
public class HackathonService {

    @Autowired
    private HackathonRepository hackathonRepository;

    // Create a new hackathon
    public Mono<Hackathon> createHackathon(@Valid Hackathon hackathon) {
        hackathon.setCreatedAt(LocalDateTime.now().toString());
        hackathon.setParticipants(new ArrayList<>());
        return hackathonRepository.save(hackathon);
    }

    // Get all hackathons
    public Flux<Hackathon> getAllHackathons() {
        return hackathonRepository.findAll();
    }

    // Register a participant for a hackathon
    public Mono<Hackathon> registerParticipant(@NotBlank String hackathonId, @NotBlank String userId) {
        return hackathonRepository.findById(hackathonId)
                .switchIfEmpty(Mono.error(new RuntimeException("Hackathon not found")))
                .flatMap(hackathon -> {
                    if (hackathon.getParticipants().contains(userId)) {
                        return Mono.error(new RuntimeException("User already registered"));
                    }
                    if (hackathon.getParticipants().size() >= hackathon.getMaxParticipants()) {
                        return Mono.error(new RuntimeException("Hackathon is full"));
                    }
                    hackathon.getParticipants().add(userId);
                    return hackathonRepository.save(hackathon);
                });
    }

    // Count all hackathons
    public Mono<Long> countHackathons() {
        return hackathonRepository.count();
    }

    // ✅ Get hackathon by ID (used in PUT / update)
    public Mono<Hackathon> getHackathonById(@NotBlank String hackathonId) {
        return hackathonRepository.findById(hackathonId)
                .switchIfEmpty(Mono.error(new IllegalArgumentException("Hackathon not found")));
    }

    // ✅ Update an existing hackathon
    public Mono<Hackathon> updateHackathon(@Valid Hackathon hackathon) {
        return hackathonRepository.save(hackathon);
    }
}
