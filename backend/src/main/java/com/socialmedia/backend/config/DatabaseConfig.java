package com.socialmedia.backend.config;

import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import javax.sql.DataSource;

@Configuration
public class DatabaseConfig {
    
    @Bean
    public DataSource getDataSource() {
        return DataSourceBuilder.create()
            .driverClassName("com.mysql.cj.jdbc.Driver")
            .url("jdbc:mysql://localhost:3306/socialmedia?createDatabaseIfNotExist=true")
            .username("root")
            .password("kayapaKO#123") 
            .build();
    }
}