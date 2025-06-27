package com.mrz1m.tickets.ticketing.services;

import com.mrz1m.tickets.ticketing.dtos.AddCommentDto;
import com.mrz1m.tickets.ticketing.dtos.AssignTicketDto;
import com.mrz1m.tickets.ticketing.dtos.CreateTicketDto;
import com.mrz1m.tickets.ticketing.dtos.TicketDetailDto;
import com.mrz1m.tickets.ticketing.dtos.TicketSummaryDto;
import com.mrz1m.tickets.ticketing.dtos.UpdateTicketDto;
import com.mrz1m.tickets.ticketing.dtos.UpdateTicketStatusDto;
import com.mrz1m.tickets.auth.entities.UserProfile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

public interface TicketService {

    Page<TicketSummaryDto> findAllTickets(Pageable pageable);

    Page<TicketSummaryDto> findAllTicketsAssignedTo(Long userId, Pageable pageable);

    Page<TicketSummaryDto> findAllUnassigned(Pageable pageable);

    TicketDetailDto findTicketById(Long ticketId);

    TicketDetailDto createTicket(CreateTicketDto request, UserProfile currentUser);

    TicketDetailDto updateTicket(Long ticketId, UpdateTicketDto request, UserProfile currentUser);

    void deleteTicket(Long ticketId); // <-- NUOVA FIRMA

    TicketDetailDto addComment(Long ticketId, AddCommentDto request, UserProfile currentUser);

    TicketDetailDto assignTicket(Long ticketId, AssignTicketDto request, UserProfile currentUser);

    TicketDetailDto changeStatus(Long ticketId, UpdateTicketStatusDto request, UserProfile currentUser);

    TicketDetailDto addAttachment(Long ticketId, MultipartFile file, UserProfile currentUser);

    Map<String, Object> downloadAttachment(Long attachmentId);
}