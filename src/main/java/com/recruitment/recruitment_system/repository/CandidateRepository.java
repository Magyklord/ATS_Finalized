package com.recruitment.recruitment_system.repository;

import com.recruitment.recruitment_system.model.Candidate;
import org.springframework.data.jpa.repository.JpaRepository;

//an interface copies properties from the extension , classes cant do the same
public interface CandidateRepository extends JpaRepository<Candidate, Long>{
}
