
package com.recruitment.recruitment_system.controller;

import com.recruitment.recruitment_system.model.Resume;
import com.recruitment.recruitment_system.service.ResumeService;
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
public class ResumeController {

    private final ResumeService resumeService;

    public ResumeController(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

    @PostMapping(
            value = "/candidates/{candidateId}/resume",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    @ResponseStatus(HttpStatus.CREATED)
    public Resume uploadResume(
            @PathVariable Long candidateId,
            @RequestParam("file") MultipartFile file) {
        return resumeService.uploadResume(candidateId, file);
    }

    @GetMapping("/resumes/{id}")
    public ResponseEntity<Resume> getResumeById(@PathVariable Long id){
        return resumeService.getResumeById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
}
