
package com.recruitment.recruitment_system.controller;

import com.recruitment.recruitment_system.model.ScreeningResult;
import com.recruitment.recruitment_system.service.ScreeningResultService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/screening-results")
public class ScreeningResultController {

    private final ScreeningResultService screeningResultService;

    public ScreeningResultController(
            ScreeningResultService screeningResultService) {
        this.screeningResultService = screeningResultService;
    }

    @PostMapping("/resumes/{resumeId}")
    @ResponseStatus(HttpStatus.CREATED)
    public ScreeningResult saveScreeningResult(
            @PathVariable Long resumeId,
            @jakarta.validation.Valid @RequestBody ScreeningResult result) {

        return screeningResultService.saveScreeningResult(
                resumeId, result);
    }

    @GetMapping
    public List<ScreeningResult> getAllScreeningResults() {
        return screeningResultService.getAllScreeningResults();
    }

    @GetMapping("/resumes/{resumeId}")
    public List<ScreeningResult> getResultsByResumeId(
            @PathVariable Long resumeId) {

        return screeningResultService.getResultsByResumeId(resumeId);
    }
}
