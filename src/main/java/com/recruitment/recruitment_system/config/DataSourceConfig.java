package com.recruitment.recruitment_system.config;

import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

@Configuration
public class DataSourceConfig {

    private static final Logger log = LoggerFactory.getLogger(DataSourceConfig.class);

    @Value("${spring.datasource.url:jdbc:postgresql://localhost:5432/recruitment_db}")
    private String pgUrl;

    @Value("${spring.datasource.username:postgres}")
    private String pgUser;

    @Value("${spring.datasource.password:varun2006}")
    private String pgPassword;

    @Bean
    @Primary
    public DataSource dataSource() {
        // If explicitly requested H2 profile, return H2 directly
        String activeProfile = System.getProperty("spring.profiles.active", System.getenv("SPRING_PROFILES_ACTIVE"));
        if ("h2".equalsIgnoreCase(activeProfile)) {
            log.info("H2 profile explicitly active. Using in-memory H2 database.");
            return createH2DataSource();
        }

        // Otherwise, attempt PostgreSQL connection with automatic database creation
        try {
            log.info("Connecting to PostgreSQL at: {} ...", pgUrl);
            ensurePostgresDatabaseExists();

            HikariDataSource ds = new HikariDataSource();
            ds.setJdbcUrl(pgUrl);
            ds.setUsername(pgUser);
            ds.setPassword(pgPassword);
            ds.setDriverClassName("org.postgresql.Driver");
            ds.setInitializationFailTimeout(3000); // 3 seconds timeout for fast failover

            // Test live connection
            try (Connection conn = ds.getConnection()) {
                log.info("Successfully connected to PostgreSQL database!");
                return ds;
            }
        } catch (Exception e) {
            log.warn("PostgreSQL unavailable ({} : {}). Automatically falling back to in-memory H2 database (PostgreSQL mode)!",
                    e.getClass().getSimpleName(), e.getMessage());
        }

        return createH2DataSource();
    }

    private DataSource createH2DataSource() {
        log.info("Initializing in-memory H2 database with PostgreSQL compatibility...");
        HikariDataSource ds = new HikariDataSource();
        ds.setJdbcUrl("jdbc:h2:mem:recruitment_db;DB_CLOSE_DELAY=-1;MODE=PostgreSQL");
        ds.setUsername("sa");
        ds.setPassword("");
        ds.setDriverClassName("org.h2.Driver");
        return ds;
    }

    private void ensurePostgresDatabaseExists() {
        if (pgUrl == null || !pgUrl.contains("postgresql")) return;
        try {
            int lastSlash = pgUrl.lastIndexOf('/');
            if (lastSlash == -1) return;
            String baseUrl = pgUrl.substring(0, lastSlash + 1) + "postgres";
            String dbName = pgUrl.substring(lastSlash + 1);
            if (dbName.contains("?")) {
                dbName = dbName.substring(0, dbName.indexOf('?'));
            }

            try (Connection conn = DriverManager.getConnection(baseUrl, pgUser, pgPassword);
                 Statement stmt = conn.createStatement();
                 ResultSet rs = stmt.executeQuery("SELECT 1 FROM pg_database WHERE datname = '" + dbName + "'")) {
                if (!rs.next()) {
                    log.info("PostgreSQL database '{}' does not exist. Auto-creating database now...", dbName);
                    stmt.executeUpdate("CREATE DATABASE " + dbName);
                    log.info("Database '{}' successfully created in PostgreSQL!", dbName);
                }
            }
        } catch (Exception e) {
            log.debug("Database provisioning note: {}", e.getMessage());
        }
    }
}
