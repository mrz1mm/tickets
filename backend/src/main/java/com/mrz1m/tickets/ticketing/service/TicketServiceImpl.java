package com.mrz1m.tickets.ticketing.service;

import com.mrz1m.tickets.auth.repository.UserRepository;
import com.mrz1m.tickets.auth.entity.UserProfile;
import com.mrz1m.tickets.ticketing.dto.*;
import com.mrz1m.tickets.ticketing.entity.Department;
import com.mrz1m.tickets.ticketing.entity.Ticket;
import com.mrz1m.tickets.ticketing.entity.TicketAttachment;
import com.mrz1m.tickets.ticketing.entity.TicketHistory;
import com.mrz1m.tickets.ticketing.enums.HistoryEventType;
import com.mrz1m.tickets.ticketing.enums.TicketStatus;
import com.mrz1m.tickets.ticketing.exception.ResourceNotFoundException;
import com.mrz1m.tickets.ticketing.mapper.TicketMapper;
import com.mrz1m.tickets.ticketing.repository.DepartmentRepository;
import com.mrz1m.tickets.ticketing.repository.TicketAttachmentRepository;
import com.mrz1m.tickets.ticketing.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class TicketServiceImpl implements TicketService {

    @Autowired
    TicketRepository ticketRepository;
    @Autowired
    DepartmentRepository departmentRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    TicketAttachmentRepository ticketAttachmentRepository;
    @Autowired
    TicketMapper ticketMapper;
    @Autowired
    FileStorageService fileStorageService;

    @Override
    @Transactional(readOnly = true)
    public Page<TicketSummaryDto> findAllTickets(Pageable pageable) {
        return ticketRepository.findAll(pageable).map(ticketMapper::toTicketSummaryDto);
    }

    @Override
    @Transactional(readOnly = true)
    public TicketDetailDto findTicketById(Long ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket", "id", ticketId));
        return ticketMapper.toTicketDetailDto(ticket);
    }

    @Override
    @Transactional
    public TicketDetailDto createTicket(CreateTicketDto request, UserProfile currentUser) {
        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", request.getDepartmentId()));

        Ticket newTicket = ticketMapper.toTicketEntity(request);
        newTicket.setRequester(currentUser);
        newTicket.setDepartment(department);
        newTicket.setStatus(TicketStatus.APERTO);

        TicketHistory creationEvent = createHistoryEvent(newTicket, currentUser, HistoryEventType.TICKET_CREATION, "Ticket creato.");
        newTicket.getHistory().add(creationEvent);

        Ticket savedTicket = ticketRepository.save(newTicket);
        return ticketMapper.toTicketDetailDto(savedTicket);
    }

    @Override
    @Transactional
    public TicketDetailDto updateTicket(Long ticketId, UpdateTicketDto request, UserProfile currentUser) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket", "id", ticketId));

        if(request.getTitle() != null) ticket.setTitle(request.getTitle());
        if(request.getDescription() != null) ticket.setDescription(request.getDescription());

        Ticket savedTicket = ticketRepository.save(ticket);
        return ticketMapper.toTicketDetailDto(savedTicket);
    }

    @Override
    @Transactional
    public TicketDetailDto addComment(Long ticketId, AddCommentDto request, UserProfile currentUser) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket", "id", ticketId));

        TicketHistory commentEvent = createHistoryEvent(ticket, currentUser, HistoryEventType.COMMENT, request.getContent());
        ticket.getHistory().add(commentEvent);

        Ticket savedTicket = ticketRepository.save(ticket);
        return ticketMapper.toTicketDetailDto(savedTicket);
    }

    @Override
    @Transactional
    public TicketDetailDto assignTicket(Long ticketId, AssignTicketDto request, UserProfile currentUser) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket", "id", ticketId));
        UserProfile newAssignee = userRepository.findById(request.getAssigneeId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.getAssigneeId()));

        String oldAssigneeName = ticket.getAssignee() != null ? ticket.getAssignee().getDisplayName() : "Nessuno";

        ticket.setAssignee(newAssignee);
        if(ticket.getStatus() == TicketStatus.APERTO) {
            ticket.setStatus(TicketStatus.IN_LAVORAZIONE);
        }

        String historyContent = String.format("Assegnato a %s (da %s).", newAssignee.getDisplayName(), oldAssigneeName);
        TicketHistory assignmentEvent = createHistoryEvent(ticket, currentUser, HistoryEventType.ASSIGNMENT, historyContent);
        ticket.getHistory().add(assignmentEvent);

        Ticket savedTicket = ticketRepository.save(ticket);
        return ticketMapper.toTicketDetailDto(savedTicket);
    }

    @Override
    @Transactional
    public TicketDetailDto changeStatus(Long ticketId, UpdateTicketStatusDto request, UserProfile currentUser) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket", "id", ticketId));

        TicketStatus oldStatus = ticket.getStatus();
        TicketStatus newStatus = request.getStatus();

        if (oldStatus == newStatus) return ticketMapper.toTicketDetailDto(ticket);

        ticket.setStatus(newStatus);

        String historyContent = String.format("Stato cambiato da %s a %s.", oldStatus, newStatus);
        TicketHistory statusEvent = createHistoryEvent(ticket, currentUser, HistoryEventType.STATUS_CHANGE, historyContent);
        ticket.getHistory().add(statusEvent);

        Ticket savedTicket = ticketRepository.save(ticket);
        return ticketMapper.toTicketDetailDto(savedTicket);
    }

    @Override
    @Transactional
    public TicketDetailDto addAttachment(Long ticketId, MultipartFile file, UserProfile currentUser) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket", "id", ticketId));

        String filePath = fileStorageService.storeFile(file, ticketId);

        TicketAttachment attachment = TicketAttachment.builder()
                .ticket(ticket)
                .uploader(currentUser)
                .fileName(StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename())))
                .filePath(filePath)
                .mimeType(file.getContentType())
                .fileSizeBytes(file.getSize())
                .build();

        ticket.getAttachments().add(attachment);

        String historyContent = String.format("File allegato: %s.", attachment.getFileName());
        TicketHistory attachmentEvent = createHistoryEvent(ticket, currentUser, HistoryEventType.ATTACHMENT_ADDED, historyContent);
        ticket.getHistory().add(attachmentEvent);

        Ticket savedTicket = ticketRepository.save(ticket);
        return ticketMapper.toTicketDetailDto(savedTicket);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> downloadAttachment(Long attachmentId) {
        TicketAttachment attachment = ticketAttachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Attachment", "id", attachmentId));

        Resource resource = fileStorageService.loadFileAsResource(attachment.getFilePath());

        return Map.of("resource", resource, "fileName", attachment.getFileName());
    }

    private TicketHistory createHistoryEvent(Ticket ticket, UserProfile user, HistoryEventType eventType, String content) {
        return TicketHistory.builder()
                .ticket(ticket)
                .user(user)
                .eventType(eventType)
                .content(content)
                .build();
    }
}