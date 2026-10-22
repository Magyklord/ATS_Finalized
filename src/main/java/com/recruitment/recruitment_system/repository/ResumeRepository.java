package com.recruitment.recruitment_system.repository;

import com.recruitment.recruitment_system.model.Resume;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResumeRepository extends JpaRepository<Resume, Long> {
}
