package com.mrz1m.tickets.ticketing.events;

import com.mrz1m.tickets.ticketing.entities.Ticket;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class TicketStatusChangedEvent extends ApplicationEvent {
    private final Ticket ticket;
    private final String oldStatus;
    private final String newStatus;
    private final boolean isAutomatic; // Per sapere se il cambio è stato automatico o manuale

    public TicketStatusChangedEvent(Object source, Ticket ticket, String oldStatus, String newStatus, boolean isAutomatic) {
        super(source);
        this.ticket = ticket;
        this.oldStatus = oldStatus;
        this.newStatus = newStatus;
        this.isAutomatic = isAutomatic;
    }
}