package com.recruitment.recruitment_system.controller;

import com.recruitment.recruitment_system.model.Job;
import com.recruitment.recruitment_system.service.JobService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.List;

@RestController
@RequestMapping("/api/jobs") //out of all the postman methods , this maps the requests accordingly under a unified "api\jobs" call
//defines the common URL path for all endpoints inside this controller.
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService){
        this.jobService=jobService;
    }

    @PostMapping //when u click post on postman , it executes the below fn
    public Job createJob(@Valid @RequestBody Job job){
        return jobService.createJob(job);
    }

    @GetMapping //when u click get on postman , it executes the below fn
    public List<Job> getAllJobs(){
        return jobService.getAllJobs();

    }

    @GetMapping("/{id}")
    public ResponseEntity<Job> getJobById(@PathVariable Long id) {
        return jobService.getJobById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Job> updateJob(
            @PathVariable Long id,
            @Valid @RequestBody Job updatedJob){

        return jobService.updateJob(id, updatedJob).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Job> deleteJob(@PathVariable Long id){
        boolean deleted = jobService.deleteJob(id);

        if(deleted){
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.notFound().build();
    }


}
