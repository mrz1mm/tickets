package com.mrz1m.tickets.ticketing.listner;

import com.mrz1m.tickets.auth.entity.UserProfile;
import com.mrz1m.tickets.auth.repository.UserRepository;
import com.mrz1m.tickets.core.service.NotificationService;
import com.mrz1m.tickets.ticketing.dto.NotificationDto;
import com.mrz1m.tickets.ticketing.entity.Ticket;
import com.mrz1m.tickets.ticketing.events.CommentAddedEvent;
import com.mrz1m.tickets.ticketing.events.TicketAssignedEvent;
import com.mrz1m.tickets.ticketing.events.TicketCreatedEvent;
import com.mrz1m.tickets.ticketing.events.TicketStatusChangedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class TicketNotificationListener {

    private final NotificationService notificationService;
    private final UserRepository userRepository;
    private static final String NOTIFICATION_QUEUE = "/queue/notifications";

    @EventListener
    public void handleTicketCreated(TicketCreatedEvent event) {
        Ticket ticket = event.getTicket();
        String message = String.format("Nuovo ticket #%d: '%s' richiede attenzione.", ticket.getId(), ticket.getTitle());
        NotificationDto payload = new NotificationDto("NUOVO TICKET", message, ticket.getId());

        List<UserProfile> usersToNotify = userRepository.findAllByPermissionName("TICKET_ASSIGN");
        usersToNotify.forEach(user ->
                notificationService.notifyUser(user.getId().toString(), NOTIFICATION_QUEUE, payload)
        );
    }

    @EventListener
    public void handleTicketAssigned(TicketAssignedEvent event) {
        Ticket ticket = event.getTicket();
        if (ticket.getAssignee() != null) {
            String message = String.format("Ti è stato assegnato il ticket #%d: '%s'.", ticket.getId(), ticket.getTitle());
            NotificationDto payload = new NotificationDto("TICKET ASSEGNATO", message, ticket.getId());
            notificationService.notifyUser(ticket.getAssignee().getId().toString(), NOTIFICATION_QUEUE, payload);
        }
    }

    @EventListener
    public void handleCommentAdded(CommentAddedEvent event) {
        Ticket ticket = event.getTicket();
        UserProfile author = event.getCommentAuthor();
        UserProfile requester = ticket.getRequester();
        UserProfile assignee = ticket.getAssignee();

        // Se l'autore è il richiedente, notifica l'assegnatario (se esiste)
        if (author.getId().equals(requester.getId()) && assignee != null) {
            String message = String.format("Nuova risposta da %s sul ticket #%d.", author.getDisplayName(), ticket.getId());
            NotificationDto payload = new NotificationDto("NUOVA RISPOSTA", message, ticket.getId());
            notificationService.notifyUser(assignee.getId().toString(), NOTIFICATION_QUEUE, payload);
        }
        // Se l'autore è l'assegnatario, notifica il richiedente
        else if (assignee != null && author.getId().equals(assignee.getId())) {
            String message = String.format("Il tecnico %s ha risposto al tuo ticket #%d.", author.getDisplayName(), ticket.getId());
            NotificationDto payload = new NotificationDto("NUOVA RISPOSTA", message, ticket.getId());
            notificationService.notifyUser(requester.getId().toString(), NOTIFICATION_QUEUE, payload);
        }
    }

    @EventListener
    public void handleStatusChanged(TicketStatusChangedEvent event) {
        Ticket ticket = event.getTicket();
        UserProfile requester = ticket.getRequester();
        UserProfile assignee = ticket.getAssignee();
        String message = String.format("Lo stato del ticket #%d è cambiato da %s a %s.", ticket.getId(), event.getOldStatus(), event.getNewStatus());
        NotificationDto payload = new NotificationDto("STATO AGGIORNATO", message, ticket.getId());

        // Se il cambio è automatico (risposta utente), notifica l'assegnatario
        if (event.isAutomatic() && assignee != null) {
            notificationService.notifyUser(assignee.getId().toString(), NOTIFICATION_QUEUE, payload);
        }
        // Se il cambio è manuale (fatto da un tecnico), notifica il richiedente
        else if (!event.isAutomatic()) {
            notificationService.notifyUser(requester.getId().toString(), NOTIFICATION_QUEUE, payload);
        }
    }
}