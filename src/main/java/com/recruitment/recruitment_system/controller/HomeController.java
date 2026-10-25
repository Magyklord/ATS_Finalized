package com.recruitment.recruitment_system.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public Map<String, Object> home() {
        return Map.of(
            "status", "UP",
            "service", "FacultyHire Java Backend",
            "version", "1.0.0",
            "message", "Spring Boot recruitment system is running smoothly!",
            "endpoints", Map.of(
                "jobs", "/api/jobs",
                "candidates", "/api/candidates",
                "screeningResults", "/api/screening-results"
            )
        );
    }

    @GetMapping("/health")
    public Map<String, Object> health() {
        return Map.of(
            "status", "UP",
            "service", "FacultyHire Java Backend"
        );
    }
}
