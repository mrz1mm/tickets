package com.mrz1m.tickets.ticketing.repository;

import com.mrz1m.tickets.ticketing.entity.Ticket;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    /**
     * Conta il numero di ticket associati a un specifico ID di dipartimento.
     * @param departmentId L'ID del dipartimento.
     * @return Il numero di ticket associati.
     */
    long countByDepartmentId(Long departmentId);

    /**
     * Trova una pagina di ticket assegnati a un utente specifico.
     * @param assigneeId L'ID dell'utente assegnatario.
     * @param pageable Le informazioni per la paginazione.
     * @return Una pagina di Ticket.
     */
    Page<Ticket> findByAssigneeId(Long assigneeId, Pageable pageable);

    /**
     * Trova una pagina di ticket che non sono ancora stati assegnati.
     * @param pageable Le informazioni per la paginazione.
     * @return Una pagina di Ticket.
     */
    Page<Ticket> findByAssigneeIsNull(Pageable pageable);
}
