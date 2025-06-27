package com.mrz1m.tickets.ticketing.events;

import com.mrz1m.tickets.auth.entities.UserProfile;
import com.mrz1m.tickets.ticketing.entities.Ticket;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class CommentAddedEvent extends ApplicationEvent {
    private final Ticket ticket;
    private final UserProfile commentAuthor;

    public CommentAddedEvent(Object source, Ticket ticket, UserProfile commentAuthor) {
        super(source);
        this.ticket = ticket;
        this.commentAuthor = commentAuthor;
    }
}