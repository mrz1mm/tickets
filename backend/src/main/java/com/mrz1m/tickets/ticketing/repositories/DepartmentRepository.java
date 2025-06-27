package com.mrz1m.tickets.ticketing.repositories;

import com.mrz1m.tickets.ticketing.entities.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DepartmentRepository extends JpaRepository<Department, Long> {

    /**
     * Controlla se un dipartimento ha dei ticket associati.
     * @param departmentId L'ID del dipartimento.
     * @return true se esistono ticket associati, false altrimenti.
     */
    @Query("SELECT CASE WHEN COUNT(t) > 0 THEN TRUE ELSE FALSE END FROM Ticket t WHERE t.department.id = :departmentId")
    boolean hasAssociatedTickets(@Param("departmentId") Long departmentId);
}