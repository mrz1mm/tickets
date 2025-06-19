package com.mrz1m.tickets.ticketing.service;

import com.mrz1m.tickets.ticketing.exception.FileStorageException;
import com.mrz1m.tickets.ticketing.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Objects;

@Service
public class FileStorageServiceImpl implements FileStorageService {

    @Autowired
    Path fileStorageLocation;

    @Override
    public String storeFile(MultipartFile file, Long ticketId) {
        String originalFileName = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));

        try {
            if (originalFileName.contains("..")) {
                throw new FileStorageException("Nome file non valido " + originalFileName);
            }

            // Crea una sottodirectory per il ticket se non esiste
            Path ticketDirectory = this.fileStorageLocation.resolve("ticket_" + ticketId);
            Files.createDirectories(ticketDirectory);

            // Costruisce il percorso finale del file
            Path targetLocation = ticketDirectory.resolve(originalFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Restituisce il percorso relativo per salvarlo nel DB
            return "ticket_" + ticketId + "/" + originalFileName;

        } catch (IOException ex) {
            throw new FileStorageException("Impossibile salvare il file " + originalFileName, ex);
        }
    }

    @Override
    public Resource loadFileAsResource(String filePath) {
        try {
            Path file = this.fileStorageLocation.resolve(filePath).normalize();
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists()) {
                return resource;
            } else {
                throw new ResourceNotFoundException("File", "path", filePath);
            }
        } catch (MalformedURLException ex) {
            throw new ResourceNotFoundException("File", "path", filePath, ex);
        }
    }
}