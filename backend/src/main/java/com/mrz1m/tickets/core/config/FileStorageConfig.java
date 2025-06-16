package com.mrz1m.tickets.core.config;

import com.mrz1m.tickets.ticketing.exception.FileStorageException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class FileStorageConfig {

    // Legge la proprietà dal file application.properties
    @Value("${file.upload-dir}")
    private String uploadDir;

    @Bean
    public Path fileStorageLocation() {
        // Crea l'oggetto Path a partire dalla stringa letta
        Path path = Paths.get(this.uploadDir).toAbsolutePath().normalize();

        try {
            // Si assicura che la directory esista, altrimenti la crea
            Files.createDirectories(path);
        } catch (Exception ex) {
            // Se non riesce a creare la directory, lancia un'eccezione che blocca l'avvio
            throw new FileStorageException("Impossibile creare la directory dove salvare i file.", ex);
        }
        return path;
    }
}