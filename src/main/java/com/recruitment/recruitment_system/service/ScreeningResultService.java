
package com.recruitment.recruitment_system.service;

import org.springframework.validation.annotation.Validated;
import com.recruitment.recruitment_system.model.Resume;
import com.recruitment.recruitment_system.model.ScreeningResult;
import com.recruitment.recruitment_system.repository.ResumeRepository;
import com.recruitment.recruitment_system.repository.ScreeningResultRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;



@Service
@Validated
public class ScreeningResultService {


    private final ScreeningResultRepository screeningResultRepository;
    private final ResumeRepository resumeRepository;

    public ScreeningResultService(
            ScreeningResultRepository screeningResultRepository,
            ResumeRepository resumeRepository) {
        this.screeningResultRepository = screeningResultRepository;
        this.resumeRepository = resumeRepository;
    }



    public ScreeningResult saveScreeningResult(
            Long resumeId,
            ScreeningResult result) {

        // 1. Validate the score before saving
        if (result.getMatchScore() == null
                || result.getMatchScore() < 0
                || result.getMatchScore() > 100) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Match score must be between 0 and 100");
        }

        // 2. Check whether the resume exists
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Resume not found"));

        // 3. Associate the result with the resume
        result.setResume(resume);

        // 4. Record the screening timestamp
        result.setScreenedAt(LocalDateTime.now());

        // 5. Save the result in PostgreSQL
        return screeningResultRepository.save(result);
    }


    public List<ScreeningResult> getAllScreeningResults() {
        return screeningResultRepository.findAll();
    }

    public List<ScreeningResult> getResultsByResumeId(Long resumeId) {
        return screeningResultRepository.findAll()
                .stream()
                .filter(result ->
                        result.getResume().getId().equals(resumeId))
                .toList();
    }
}
