package com.mrz1m.tickets.auth.services;

import com.mrz1m.tickets.auth.dtos.UserDetailDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {
    /**
     * Recupera una pagina di utenti per l'azienda corrente (determinata dal contesto di sicurezza).
     * @param pageable Informazioni per la paginazione.
     * @return Una pagina di DTO con i dettagli degli utenti.
     */
    Page<UserDetailDto> getUsersForCurrentCompany(Pageable pageable);
}