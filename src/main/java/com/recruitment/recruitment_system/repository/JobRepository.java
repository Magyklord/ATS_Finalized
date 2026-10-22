package com.recruitment.recruitment_system.repository;
import com.recruitment.recruitment_system.model.Job;
import org.springframework.data.jpa.repository.JpaRepository; //this retrieves alot of db operation cmds

public interface JobRepository extends JpaRepository<Job, Long>{
    //the above line grants our custom JobRepository all the permissions and features of JPA repository
    //Job is the name of the model and Long is the datatype of the primary key(id)
}

