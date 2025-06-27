package com.mrz1m.tickets.ticketing.events;

import com.mrz1m.tickets.ticketing.entity.Ticket;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class TicketAssignedEvent extends ApplicationEvent {
    private final Ticket ticket;

    public TicketAssignedEvent(Object source, Ticket ticket) {
        super(source);
        this.ticket = ticket;
    }
}