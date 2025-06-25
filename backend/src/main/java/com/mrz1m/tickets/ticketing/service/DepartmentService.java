package com.mrz1m.tickets.ticketing.service;

import com.mrz1m.tickets.ticketing.dto.CreateDepartmentDto;
import com.mrz1m.tickets.ticketing.dto.DepartmentDto;
import com.mrz1m.tickets.ticketing.dto.UpdateDepartmentDto;
import java.util.List;
import java.util.Optional;

public interface DepartmentService {

    /**
     * Crea un nuovo dipartimento.
     *
     * @param createDepartmentDto DTO con i dati per la creazione.
     * @return Il DTO del dipartimento appena creato.
     */
    DepartmentDto createDepartment(CreateDepartmentDto createDepartmentDto);

    /**
     * Trova tutti i dipartimenti non eliminati.
     *
     * @return Una lista di DTO dei dipartimenti.
     */
    List<DepartmentDto> findAll();

    /**
     * Trova un dipartimento tramite il suo ID.
     *
     * @param id L'ID del dipartimento.
     * @return Un Optional contenente il DTO del dipartimento se trovato.
     */
    Optional<DepartmentDto> findById(Long id);

    /**
     * Aggiorna un dipartimento esistente.
     *
     * @param id L'ID del dipartimento da aggiornare.
     * @param updateDepartmentDto DTO con i nuovi dati.
     * @return Un Optional contenente il DTO del dipartimento aggiornato.
     */
    Optional<DepartmentDto> updateDepartment(Long id, UpdateDepartmentDto updateDepartmentDto);

    /**
     * Esegue un soft delete di un dipartimento.
     *
     * @param id L'ID del dipartimento da eliminare.
     * @return true se l'eliminazione ha avuto successo, false altrimenti.
     */
    boolean deleteDepartment(Long id);


}