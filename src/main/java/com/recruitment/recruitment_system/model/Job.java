package com.recruitment.recruitment_system.model; //this job program is part of model self declared package

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id; //auto gen IDs
import jakarta.validation.constraints.NotBlank; //to prevent empty values

@Entity
public class Job {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY) //auto serial numbers for each ID

    //declaring all the fields
    private Long id;
    @NotBlank(message="Job title is needed") //to prevent whitespace or empty values
    private String title;
    @NotBlank(message="Department is needed")
    private String department;
    @NotBlank(message="Job Description is needed")
    private String description;

    public Job(){
    }

    //getters and setters for each field
    public Long getId(){
        return id;
    }
    public void setId(Long id){
        this.id = id;
    }
    public String getTitle(){
        return title;
    }
    public void setTitle(String title){
        this.title=title;
    }
    public String getDepartment(){
        return department;
    }
    public void setDepartment(String department){
        this.department=department;
    }
    public String getDescription(){
        return description;
    }
    public void setDescription(String description){
        this.description=description;
    }
}
