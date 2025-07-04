package com.mrz1m.tickets.auth.events;

import com.mrz1m.tickets.auth.entities.Invitation;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class InvitationCreatedEvent extends ApplicationEvent {
    private final Invitation invitation;

    public InvitationCreatedEvent(Object source, Invitation invitation) {
        super(source);
        this.invitation = invitation;
    }
}