package com.recruitment.recruitment_system.repository;

import com.recruitment.recruitment_system.model.ScreeningResult;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ScreeningResultRepository extends JpaRepository<ScreeningResult, Long> {
    List<ScreeningResult> findByResumeId(Long resumeId);
}
