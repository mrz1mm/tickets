package com.mrz1m.tickets.ticketing.repository;

import com.mrz1m.tickets.ticketing.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketRepository extends JpaRepository<Ticket, Long> {}
