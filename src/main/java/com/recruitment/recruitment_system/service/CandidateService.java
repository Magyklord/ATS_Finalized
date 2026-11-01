package com.recruitment.recruitment_system.service;

import com.recruitment.recruitment_system.model.Candidate;
import com.recruitment.recruitment_system.model.Job;
import com.recruitment.recruitment_system.model.Resume;
import com.recruitment.recruitment_system.model.ScreeningResult;
import com.recruitment.recruitment_system.repository.CandidateRepository;
import com.recruitment.recruitment_system.repository.JobRepository;
import com.recruitment.recruitment_system.repository.ResumeRepository;
import com.recruitment.recruitment_system.repository.ScreeningResultRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CandidateService {

    private final CandidateRepository candidateRepository;
    private final JobRepository jobRepository;
    private final ResumeRepository resumeRepository;
    private final ScreeningResultRepository screeningResultRepository;

    public CandidateService(
            CandidateRepository candidateRepository,
            JobRepository jobRepository,
            ResumeRepository resumeRepository,
            ScreeningResultRepository screeningResultRepository) {
        this.candidateRepository = candidateRepository;
        this.jobRepository = jobRepository;
        this.resumeRepository = resumeRepository;
        this.screeningResultRepository = screeningResultRepository;
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

    public Optional<Candidate> updateCandidate(Long id, Candidate updatedCandidate, Long newJobId) {
        return candidateRepository.findById(id).map(existing -> {
            existing.setFullName(updatedCandidate.getFullName());
            existing.setEmail(updatedCandidate.getEmail());
            existing.setPhone(updatedCandidate.getPhone());
            if (newJobId != null) {
                jobRepository.findById(newJobId).ifPresent(existing::setJob);
            }
            return candidateRepository.save(existing);
        });
    }

    @Transactional
    public boolean deleteCandidate(Long id) {
        Optional<Candidate> candidateOpt = candidateRepository.findById(id);
        if (candidateOpt.isPresent()) {
            Candidate candidate = candidateOpt.get();
            // Cascade delete resumes and screening results for this candidate
            List<Resume> resumes = resumeRepository.findByCandidateId(candidate.getId());
            for (Resume resume : resumes) {
                List<ScreeningResult> results = screeningResultRepository.findByResumeId(resume.getId());
                screeningResultRepository.deleteAll(results);
            }
            resumeRepository.deleteAll(resumes);
            candidateRepository.delete(candidate);
            return true;
        }
        return false;
    }
}
