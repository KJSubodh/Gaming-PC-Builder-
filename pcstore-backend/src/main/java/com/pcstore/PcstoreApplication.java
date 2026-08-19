package com.pcstore;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class PcstoreApplication {
    public static void main(String[] args) {
        SpringApplication.run(PcstoreApplication.class, args);
    }
}