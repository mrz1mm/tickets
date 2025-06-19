package com.mrz1m.tickets.ticketing.controller;

import com.mrz1m.tickets.auth.entity.UserProfile;
import com.mrz1m.tickets.auth.repository.UserRepository;
import com.mrz1m.tickets.auth.security.CustomUserProfileDetails;
import com.mrz1m.tickets.ticketing.dto.*;
import com.mrz1m.tickets.ticketing.service.TicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;
    private final UserRepository userRepository;

    // GET /api/tickets -> Lista paginata di ticket
    @GetMapping
    @PreAuthorize("hasAuthority('TICKET_READ_ALL')")
    public ResponseEntity<PagedDto<TicketSummaryDto>> getAllTickets(Pageable pageable) {
        Page<TicketSummaryDto> ticketPage = ticketService.findAllTickets(pageable);
        return ResponseEntity.ok(new PagedDto<>(ticketPage));
    }

    // GET /api/tickets/{id} -> Dettaglio di un singolo ticket
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('TICKET_READ_ALL') or @securityService.isOwnerOrAssignee(#id, principal.id)")
    public ResponseEntity<TicketDetailDto> getTicketById(@PathVariable Long id) {
        return ResponseEntity.ok(ticketService.findTicketById(id));
    }

    // POST /api/tickets -> Creazione di un nuovo ticket
    @PostMapping
    @PreAuthorize("hasAuthority('TICKET_CREATE')")
    public ResponseEntity<TicketDetailDto> createTicket(
            @Valid @RequestBody CreateTicketDto createTicketDto,
            @AuthenticationPrincipal CustomUserProfileDetails currentUser) {

        UserProfile user = getUserProfile(currentUser);
        TicketDetailDto createdTicket = ticketService.createTicket(createTicketDto, user);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest().path("/{id}")
                .buildAndExpand(createdTicket.getId()).toUri();

        return ResponseEntity.created(location).body(createdTicket);
    }

    // POST /api/tickets/{id}/comments -> Aggiunge un commento
    @PostMapping("/{id}/comments")
    @PreAuthorize("hasAuthority('TICKET_COMMENT_ALL') or @securityService.canCommentOnTicket(#id, principal.id)")
    public ResponseEntity<TicketDetailDto> addComment(
            @PathVariable Long id,
            @Valid @RequestBody AddCommentDto addCommentDto,
            @AuthenticationPrincipal CustomUserProfileDetails currentUser) {

        UserProfile user = getUserProfile(currentUser);
        TicketDetailDto updatedTicket = ticketService.addComment(id, addCommentDto, user);
        return ResponseEntity.ok(updatedTicket);
    }

    // PATCH /api/tickets/{id}/assign -> Assegna un ticket
    @PatchMapping("/{id}/assign")
    @PreAuthorize("hasAuthority('TICKET_ASSIGN')")
    public ResponseEntity<TicketDetailDto> assignTicket(
            @PathVariable Long id,
            @Valid @RequestBody AssignTicketDto assignTicketDto,
            @AuthenticationPrincipal CustomUserProfileDetails currentUser) {

        UserProfile user = getUserProfile(currentUser);
        TicketDetailDto updatedTicket = ticketService.assignTicket(id, assignTicketDto, user);
        return ResponseEntity.ok(updatedTicket);
    }

    // PATCH /api/tickets/{id}/status -> Cambia lo stato
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAuthority('TICKET_STATUS_CHANGE')")
    public ResponseEntity<TicketDetailDto> changeStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTicketStatusDto statusDto,
            @AuthenticationPrincipal CustomUserProfileDetails currentUser) {

        UserProfile user = getUserProfile(currentUser);
        TicketDetailDto updatedTicket = ticketService.changeStatus(id, statusDto, user);
        return ResponseEntity.ok(updatedTicket);
    }

    // POST /api/tickets/{id}/attachments -> Aggiunge un allegato
    @PostMapping(value = "/{id}/attachments", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAuthority('TICKET_COMMENT_ALL') or @securityService.canCommentOnTicket(#id, principal.id)")
    public ResponseEntity<TicketDetailDto> addAttachment(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal CustomUserProfileDetails currentUser) {

        UserProfile user = getUserProfile(currentUser);
        TicketDetailDto updatedTicket = ticketService.addAttachment(id, file, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(updatedTicket);
    }

    // GET /api/tickets/attachments/{attachmentId}/download -> Scarica un allegato
    @GetMapping("/attachments/{attachmentId}/download")
    @PreAuthorize("hasAuthority('TICKET_READ_ALL') or @securityService.canDownloadAttachment(#attachmentId, principal.id)")
    public ResponseEntity<Resource> downloadAttachment(@PathVariable Long attachmentId) {
        Map<String, Object> result = ticketService.downloadAttachment(attachmentId);
        Resource resource = (Resource) result.get("resource");
        String fileName = (String) result.get("fileName");

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }

    // Metodo helper per recuperare l'entità UserProfile completa
    private UserProfile getUserProfile(CustomUserProfileDetails currentUser) {
        return userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new IllegalStateException("Utente autenticato non trovato nel database."));
    }
}