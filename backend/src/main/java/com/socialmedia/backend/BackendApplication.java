package com.socialmedia.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan("com.socialmedia.backend.model")
@EnableJpaRepositories("com.socialmedia.backend.repository")
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
        System.out.println("Backend application started successfully.");
        System.out.println("Database connection established.");
        System.out.println("You can now access the API at http://localhost:8080");
    }
}