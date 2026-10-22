package com.recruitment.recruitment_system.controller;

import com.recruitment.recruitment_system.model.Candidate;
import com.recruitment.recruitment_system.service.CandidateService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/candidates")
public class CandidateController {

    private final CandidateService candidateService;

    public CandidateController(CandidateService candidateService){
        this.candidateService = candidateService;
    }

    @PostMapping("/jobs/{jobId}")
    public Candidate createCandidate(
            @PathVariable Long jobId,
            @Valid @RequestBody Candidate candidate) {
                return candidateService.createCandidateForJob(jobId, candidate);
    }

    @GetMapping
    public List<Candidate> getAllCandidates(){
        return candidateService.getAllCandidates();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Candidate> getCandidateById(@PathVariable Long id){
        return candidateService.getCandidateById(id).map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
