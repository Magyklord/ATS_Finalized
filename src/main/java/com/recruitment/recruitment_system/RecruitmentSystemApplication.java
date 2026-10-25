package com.recruitment.recruitment_system;

import com.recruitment.recruitment_system.model.Job;
import com.recruitment.recruitment_system.repository.JobRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class RecruitmentSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(RecruitmentSystemApplication.class, args);
	}

	@Bean
	CommandLineRunner initDatabase(JobRepository jobRepository) {
		return args -> {
			if (jobRepository.count() == 0) {
				Job job1 = new Job();
				job1.setTitle("Assistant Professor - AI & Machine Learning");
				job1.setDepartment("Computer Science");
				job1.setDescription("PhD in Computer Science with AI and ML teaching and research experience. Requires publications in top conferences and demonstrated teaching excellence.");
				jobRepository.save(job1);

				Job job2 = new Job();
				job2.setTitle("Associate Professor - Software Engineering");
				job2.setDepartment("School of Computing");
				job2.setDescription("PhD in Software Engineering or Computer Science with focus on distributed systems, cloud computing, or software architecture. 5+ years academic/research experience.");
				jobRepository.save(job2);

				Job job3 = new Job();
				job3.setTitle("Professor - Data Science & Analytics");
				job3.setDepartment("Information Technology");
				job3.setDescription("Distinguished academic with PhD in Data Science, Statistics, or Computer Science. Proven track record of external research grants and curriculum development.");
				jobRepository.save(job3);
			}
		};
	}

}
