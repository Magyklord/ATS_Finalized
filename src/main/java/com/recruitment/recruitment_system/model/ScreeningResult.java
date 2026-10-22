
package com.recruitment.recruitment_system.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class ScreeningResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //everything below is a validation constraint to prevent missing logs , invalid logs
    @jakarta.validation.constraints.NotNull(
            message = "Match score is required")
    @jakarta.validation.constraints.DecimalMin(
            value = "0.0",
            message = "Match score cannot be less than 0")
    @jakarta.validation.constraints.DecimalMax(
            value = "100.0",
            message = "Match score cannot exceed 100")
    private Double matchScore; //store the AI python verification score

    @jakarta.validation.constraints.NotBlank(
            message = "Matched skills are required")
    @Column(columnDefinition = "TEXT")
    private String matchedSkills; //stores matched skills

    @jakarta.validation.constraints.NotBlank(
            message = "Evidence is required")
    @Column(columnDefinition = "TEXT")
    private String evidence; //stores supporting details about choice

    @jakarta.validation.constraints.NotBlank(
            message = "Explanation is required")
    @Column(columnDefinition = "TEXT")
    private String explanation; //stores reasons about the result

    private LocalDateTime screenedAt; //time for verification and checking later

    @ManyToOne
    @JoinColumn(name = "resume_id", nullable = false)
    private Resume resume;

    public ScreeningResult() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getMatchScore() {
        return matchScore;
    }

    public void setMatchScore(Double matchScore) {
        this.matchScore = matchScore;
    }

    public String getMatchedSkills() {
        return matchedSkills;
    }

    public void setMatchedSkills(String matchedSkills) {
        this.matchedSkills = matchedSkills;
    }

    public String getEvidence() {
        return evidence;
    }

    public void setEvidence(String evidence) {
        this.evidence = evidence;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }

    public LocalDateTime getScreenedAt() {
        return screenedAt;
    }

    public void setScreenedAt(LocalDateTime screenedAt) {
        this.screenedAt = screenedAt;
    }

    public Resume getResume() {
        return resume;
    }

    public void setResume(Resume resume) {
        this.resume = resume;
    }
}
