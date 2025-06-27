package com.mrz1m.tickets.auth.security;

import com.mrz1m.tickets.ticketing.entities.Ticket;
import com.mrz1m.tickets.ticketing.entities.TicketAttachment;
import com.mrz1m.tickets.ticketing.repositories.TicketAttachmentRepository;
import com.mrz1m.tickets.ticketing.repositories.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.Optional;

@Service("securityService")
@RequiredArgsConstructor
public class SecurityService {

    private final TicketRepository ticketRepository;
    private final TicketAttachmentRepository attachmentRepository;

    public boolean isOwnerOrAssignee(Long ticketId, Long currentUserId) {
        return ticketRepository.findById(ticketId)
                .map(ticket ->
                        Objects.equals(ticket.getRequester().getId(), currentUserId) ||
                                (ticket.getAssignee() != null && Objects.equals(ticket.getAssignee().getId(), currentUserId))
                )
                .orElse(false); // Se il ticket non esiste, nega l'accesso
    }

    // Regola: puoi commentare/allegare se sei owner, assignee o hai un permesso globale
    public boolean canCommentOnTicket(Long ticketId, Long currentUserId) {
        return isOwnerOrAssignee(ticketId, currentUserId);
    }

    // Regola: puoi scaricare un allegato se hai accesso al ticket a cui appartiene
    public boolean canDownloadAttachment(Long attachmentId, Long currentUserId) {
        Optional<Ticket> ticketOpt = attachmentRepository.findById(attachmentId)
                .map(TicketAttachment::getTicket);

        return ticketOpt.map(ticket -> isOwnerOrAssignee(ticket.getId(), currentUserId)).orElse(false);
    }
}