
package com.recruitment.recruitment_system.service;

import com.recruitment.recruitment_system.model.Candidate;
import com.recruitment.recruitment_system.model.Job;
import com.recruitment.recruitment_system.repository.CandidateRepository;
import com.recruitment.recruitment_system.repository.JobRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CandidateService {

    private final CandidateRepository candidateRepository;
    private final JobRepository jobRepository;

    public CandidateService(
            CandidateRepository candidateRepository,
            JobRepository jobRepository) {
        this.candidateRepository = candidateRepository;
        this.jobRepository = jobRepository;
    }

    public Candidate createCandidate(Candidate candidate) {
        return candidateRepository.save(candidate);
    }

    public Candidate createCandidateForJob(Long jobId, Candidate candidate) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        candidate.setJob(job);

        return candidateRepository.save(candidate);
    }

    public List<Candidate> getAllCandidates() {
        return candidateRepository.findAll();
    }

    public Optional<Candidate> getCandidateById(Long id) {
        return candidateRepository.findById(id);
    }
}
