package com.mrz1m.tickets.ticketing.service;

import com.mrz1m.tickets.ticketing.dto.AddCommentDto;
import com.mrz1m.tickets.ticketing.dto.AssignTicketDto;
import com.mrz1m.tickets.ticketing.dto.CreateTicketDto;
import com.mrz1m.tickets.ticketing.dto.TicketDetailDto;
import com.mrz1m.tickets.ticketing.dto.TicketSummaryDto;
import com.mrz1m.tickets.ticketing.dto.UpdateTicketDto;
import com.mrz1m.tickets.ticketing.dto.UpdateTicketStatusDto;
import com.mrz1m.tickets.auth.entity.UserProfile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

public interface TicketService {

    Page<TicketSummaryDto> findAllTickets(Pageable pageable);

    TicketDetailDto findTicketById(Long ticketId);

    TicketDetailDto createTicket(CreateTicketDto request, UserProfile currentUser);

    TicketDetailDto updateTicket(Long ticketId, UpdateTicketDto request, UserProfile currentUser);

    TicketDetailDto addComment(Long ticketId, AddCommentDto request, UserProfile currentUser);

    TicketDetailDto assignTicket(Long ticketId, AssignTicketDto request, UserProfile currentUser);

    TicketDetailDto changeStatus(Long ticketId, UpdateTicketStatusDto request, UserProfile currentUser);

    TicketDetailDto addAttachment(Long ticketId, MultipartFile file, UserProfile currentUser);

    Map<String, Object> downloadAttachment(Long attachmentId);
}