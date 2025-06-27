package com.mrz1m.tickets.ticketing.listners;

import com.mrz1m.tickets.auth.entities.UserProfile;
import com.mrz1m.tickets.auth.repositories.UserRepository;
import com.mrz1m.tickets.core.entities.Notification;
import com.mrz1m.tickets.core.repositories.NotificationRepository;
import com.mrz1m.tickets.core.services.NotificationService;
import com.mrz1m.tickets.ticketing.entities.Ticket;
import com.mrz1m.tickets.ticketing.events.CommentAddedEvent;
import com.mrz1m.tickets.ticketing.events.TicketAssignedEvent;
import com.mrz1m.tickets.ticketing.events.TicketCreatedEvent;
import com.mrz1m.tickets.ticketing.events.TicketStatusChangedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
@RequiredArgsConstructor
public class TicketNotificationListener {

    private final NotificationService notificationService;
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private static final String NOTIFICATION_QUEUE = "/queue/notifications";

    @EventListener
    @Transactional
    public void handleTicketCreated(TicketCreatedEvent event) {
        Ticket ticket = event.getTicket();
        String title = "Nuovo Ticket";
        String message = String.format("Il ticket #%d: '%s' richiede attenzione.", ticket.getId(), ticket.getTitle());

        List<UserProfile> usersToNotify = userRepository.findAllByPermissionName("TICKET_ASSIGN");
        usersToNotify.forEach(user -> createAndSendNotification(user, ticket, title, message));
    }

    @EventListener
    @Transactional
    public void handleTicketAssigned(TicketAssignedEvent event) {
        Ticket ticket = event.getTicket();
        if (ticket.getAssignee() != null) {
            String title = "Ticket Assegnato";
            String message = String.format("Ti è stato assegnato il ticket #%d: '%s'.", ticket.getId(), ticket.getTitle());
            createAndSendNotification(ticket.getAssignee(), ticket, title, message);
        }
    }

    @EventListener
    @Transactional
    public void handleCommentAdded(CommentAddedEvent event) {
        Ticket ticket = event.getTicket();
        UserProfile author = event.getCommentAuthor();
        UserProfile requester = ticket.getRequester();
        UserProfile assignee = ticket.getAssignee();
        String title = "Nuova Risposta";

        if (author.getId().equals(requester.getId()) && assignee != null) {
            String message = String.format("Nuova risposta da %s sul ticket #%d.", author.getDisplayName(), ticket.getId());
            createAndSendNotification(assignee, ticket, title, message);
        } else if (assignee != null && author.getId().equals(assignee.getId())) {
            String message = String.format("Il tecnico %s ha risposto al tuo ticket #%d.", author.getDisplayName(), ticket.getId());
            createAndSendNotification(requester, ticket, title, message);
        }
    }

    @EventListener
    @Transactional
    public void handleStatusChanged(TicketStatusChangedEvent event) {
        Ticket ticket = event.getTicket();
        UserProfile requester = ticket.getRequester();
        UserProfile assignee = ticket.getAssignee();
        String title = "Stato Aggiornato";
        String message = String.format("Lo stato del ticket #%d è cambiato da %s a %s.", ticket.getId(), event.getOldStatus(), event.getNewStatus());

        if (event.isAutomatic() && assignee != null) {
            createAndSendNotification(assignee, ticket, title, message);
        } else if (!event.isAutomatic() && assignee != null && !assignee.getId().equals(requester.getId())) {
            createAndSendNotification(requester, ticket, title, message);
        }
    }

    private void createAndSendNotification(UserProfile user, Ticket ticket, String title, String message) {
        Notification notification = Notification.builder()
                .user(user)
                .ticket(ticket)
                .title(title)
                .message(message)
                .isRead(false)
                .build();

        Notification savedNotification = notificationRepository.save(notification);

        notificationService.notifyUser(user.getId().toString(), NOTIFICATION_QUEUE, savedNotification);
    }
}