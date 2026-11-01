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

import java.util.Optional;
import java.util.List;

@Service
public class JobService {
    private final JobRepository jobRepository;
    private final CandidateRepository candidateRepository;
    private final ResumeRepository resumeRepository;
    private final ScreeningResultRepository screeningResultRepository;

    public JobService(
            JobRepository jobRepository,
            CandidateRepository candidateRepository,
            ResumeRepository resumeRepository,
            ScreeningResultRepository screeningResultRepository) {
        this.jobRepository = jobRepository;
        this.candidateRepository = candidateRepository;
        this.resumeRepository = resumeRepository;
        this.screeningResultRepository = screeningResultRepository;
    }

    public Job createJob(Job job) {
        return jobRepository.save(job);
    }

    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    public Optional<Job> getJobById(Long id) {
        return jobRepository.findById(id);
    }

    public Optional<Job> updateJob(Long id, Job updatedJob) {
        return jobRepository.findById(id).map(existingJob -> {
            existingJob.setTitle(updatedJob.getTitle());
            existingJob.setDepartment(updatedJob.getDepartment());
            existingJob.setDescription(updatedJob.getDescription());
            return jobRepository.save(existingJob);
        });
    }

    @Transactional
    public boolean deleteJob(Long id) {
        Optional<Job> jobOpt = jobRepository.findById(id);
        if (jobOpt.isPresent()) {
            Job job = jobOpt.get();
            // Cascade delete all candidates under this job and their resumes / screening results
            List<Candidate> candidates = candidateRepository.findByJobId(job.getId());
            for (Candidate candidate : candidates) {
                List<Resume> resumes = resumeRepository.findByCandidateId(candidate.getId());
                for (Resume resume : resumes) {
                    List<ScreeningResult> results = screeningResultRepository.findByResumeId(resume.getId());
                    screeningResultRepository.deleteAll(results);
                }
                resumeRepository.deleteAll(resumes);
            }
            candidateRepository.deleteAll(candidates);
            jobRepository.delete(job);
            return true;
        }
        return false;
    }
}
