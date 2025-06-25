package com.mrz1m.tickets.ticketing.repository;

import com.mrz1m.tickets.ticketing.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    /**
     * Conta il numero di ticket associati a un specifico ID di dipartimento.
     * @param departmentId L'ID del dipartimento.
     * @return Il numero di ticket associati.
     */
    long countByDepartmentId(Long departmentId);
}
