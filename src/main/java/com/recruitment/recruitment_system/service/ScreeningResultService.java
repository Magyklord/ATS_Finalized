package com.recruitment.recruitment_system.service;

import org.springframework.validation.annotation.Validated;
import com.recruitment.recruitment_system.model.Candidate;
import com.recruitment.recruitment_system.model.Resume;
import com.recruitment.recruitment_system.model.ResumeStatus;
import com.recruitment.recruitment_system.model.ScreeningResult;
import com.recruitment.recruitment_system.repository.CandidateRepository;
import com.recruitment.recruitment_system.repository.ResumeRepository;
import com.recruitment.recruitment_system.repository.ScreeningResultRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Validated
public class ScreeningResultService {

    private final ScreeningResultRepository screeningResultRepository;
    private final ResumeRepository resumeRepository;
    private final CandidateRepository candidateRepository;

    public ScreeningResultService(
            ScreeningResultRepository screeningResultRepository,
            ResumeRepository resumeRepository,
            CandidateRepository candidateRepository) {
        this.screeningResultRepository = screeningResultRepository;
        this.resumeRepository = resumeRepository;
        this.candidateRepository = candidateRepository;
    }

    public ScreeningResult saveScreeningResult(
            Long resumeId,
            ScreeningResult result) {

        if (result.getMatchScore() == null
                || result.getMatchScore() < 0
                || result.getMatchScore() > 100) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Match score must be between 0 and 100");
        }

        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Resume not found"));

        result.setResume(resume);
        result.setScreenedAt(LocalDateTime.now());
        resume.setProcessingStatus(ResumeStatus.COMPLETED);
        resumeRepository.save(resume);

        return screeningResultRepository.save(result);
    }

    public ScreeningResult saveCandidateScreeningResult(
            Long candidateId,
            ScreeningResult result,
            String fileName) {

        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Candidate not found"));

        // Retrieve existing resume or create an association record
        List<Resume> existingResumes = resumeRepository.findByCandidateId(candidateId);
        Resume resume;
        if (!existingResumes.isEmpty()) {
            resume = existingResumes.get(existingResumes.size() - 1);
        } else {
            resume = new Resume();
            resume.setCandidate(candidate);
            resume.setOriginalFileName(fileName != null ? fileName : "resume.pdf");
            resume.setFilePath("virtual://" + (fileName != null ? fileName : "resume.pdf"));
            resume.setContentType("application/pdf");
            resume.setUploadedAt(LocalDateTime.now());
        }
        resume.setProcessingStatus(ResumeStatus.COMPLETED);
        resume = resumeRepository.save(resume);

        result.setResume(resume);
        result.setScreenedAt(LocalDateTime.now());
        return screeningResultRepository.save(result);
    }

    public List<ScreeningResult> getAllScreeningResults() {
        return screeningResultRepository.findAll();
    }

    public List<ScreeningResult> getResultsByResumeId(Long resumeId) {
        return screeningResultRepository.findByResumeId(resumeId);
    }

    public List<ScreeningResult> getResultsByCandidateId(Long candidateId) {
        List<Resume> resumes = resumeRepository.findByCandidateId(candidateId);
        return resumes.stream()
                .flatMap(r -> screeningResultRepository.findByResumeId(r.getId()).stream())
                .toList();
    }
}
