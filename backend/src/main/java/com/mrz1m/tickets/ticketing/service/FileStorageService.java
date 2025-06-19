package com.mrz1m.tickets.ticketing.service;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    /**
     * Salva un file in una sottocartella specifica per il ticket.
     * @param file Il file da salvare.
     * @param ticketId L'ID del ticket a cui il file è associato.
     * @return Il percorso relativo del file salvato.
     */
    String storeFile(MultipartFile file, Long ticketId);

    /**
     * Carica un file come risorsa.
     * @param filePath Il percorso relativo del file.
     * @return La risorsa del file.
     */
    Resource loadFileAsResource(String filePath);
}