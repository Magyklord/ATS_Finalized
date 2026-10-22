package com.recruitment.recruitment_system.service;
import com.recruitment.recruitment_system.model.ResumeStatus;

//the default imports extending properties from various repos
import com.recruitment.recruitment_system.model.Candidate;
import com.recruitment.recruitment_system.model.Resume;
import com.recruitment.recruitment_system.repository.CandidateRepository;
import com.recruitment.recruitment_system.repository.ResumeRepository;
import org.springframework.stereotype.Service;

//web service imports
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;
import java.time.LocalDateTime;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import java.util.Optional;



@Service
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final CandidateRepository candidateRepository;

    public ResumeService(
        ResumeRepository resumeRepository,
        CandidateRepository candidateRepository){
    this.resumeRepository=resumeRepository;
    this.candidateRepository=candidateRepository;
        }

    public Optional<Resume> getResumeById(Long id){
        return resumeRepository.findById(id);
    }
    public Resume uploadResume(Long candidateId, MultipartFile file) {

        // 1. Check whether the candidate exists
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Candidate not found"));

        // 2. Check whether a file was provided
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Please select a resume file");
        }

        // 3. Allow only PDF and DOCX files
        String originalFileName = file.getOriginalFilename();

        if (originalFileName == null
                || !(originalFileName.toLowerCase().endsWith(".pdf")
                || originalFileName.toLowerCase().endsWith(".docx"))) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Only PDF and DOCX files are allowed");
        }

        // 4. Generate a safe, unique filename
        String extension = originalFileName.toLowerCase().endsWith(".pdf")
                ? ".pdf" : ".docx";

        String storedFileName = UUID.randomUUID() + extension;

        // 5. Create the upload directory
        Path uploadDirectory = Paths.get("uploads", "resumes")
                .toAbsolutePath().normalize();

        try {
            Files.createDirectories(uploadDirectory);

            // 6. Save the file to disk
            Path filePath = uploadDirectory.resolve(storedFileName);
            Files.copy(file.getInputStream(), filePath);

            // 7. Create resume metadata
            Resume resume = new Resume();
            resume.setOriginalFileName(originalFileName);
            resume.setFilePath(filePath.toString());
            resume.setContentType(file.getContentType());
            resume.setProcessingStatus(ResumeStatus.UPLOADED);
            resume.setUploadedAt(LocalDateTime.now());
            resume.setCandidate(candidate);

            // 8. Save metadata in PostgreSQL
            return resumeRepository.save(resume);

        } catch (IOException e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Could not save the resume file");
        }
    }

}