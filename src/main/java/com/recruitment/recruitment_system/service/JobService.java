package com.recruitment.recruitment_system.service;

import com.recruitment.recruitment_system.model.Job; //using code from Job class
import com.recruitment.recruitment_system.repository.JobRepository; //using code from jobrepository class
import org.springframework.stereotype.Service; //from the spring framework

import javax.swing.text.html.Option;
import java.util.Optional;
import java.util.List;

@Service // because this is a service
public class JobService {
    private final JobRepository jobRepository; //creates reference to job repository like scanner fn

    public JobService(JobRepository jobRepository){ //links job service with job repository
        this.jobRepository=jobRepository;
    }

    public Job createJob(Job job){ //receives a job and saves it
        return jobRepository.save(job);
    }

    public List<Job> getAllJobs(){ //self explanatory , retrieves all jobs from the repository
        return jobRepository.findAll();
    }

    public Optional<Job> getJobById(Long id){ //optional shows if it exists or doesnt exist , the id
        return jobRepository.findById(id);
    }

    public Optional<Job> updateJob(Long id, Job updatedJob){
        return jobRepository.findById(id).map(existingJob -> { //the map line looks for the existing job by id
            existingJob.setTitle(updatedJob.getTitle());
            existingJob.setDepartment(updatedJob.getDepartment());
            existingJob.setDescription(updatedJob.getDescription());

            return jobRepository.save(existingJob);
        });
    }

    public boolean deleteJob(Long id){
        Optional<Job> job = jobRepository.findById(id);

        if(job.isPresent()){
            jobRepository.delete(job.get());
            return true;
        }
        return false;
    }
}
