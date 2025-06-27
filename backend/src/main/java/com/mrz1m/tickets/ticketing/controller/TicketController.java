package com.mrz1m.tickets.ticketing.controller;

import com.mrz1m.tickets.auth.entity.UserProfile;
import com.mrz1m.tickets.auth.repository.UserRepository;
import com.mrz1m.tickets.auth.security.CustomUserProfileDetails;
import com.mrz1m.tickets.core.payload.ApiResponse;
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
    public ResponseEntity<ApiResponse<PagedDto<TicketSummaryDto>>> getAllTickets(Pageable pageable) {
        Page<TicketSummaryDto> ticketPage = ticketService.findAllTickets(pageable);
        return ResponseEntity.ok(ApiResponse.ok("Ticket recuperati con successo", new PagedDto<>(ticketPage)));
    }

    @GetMapping("/me/assigned")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<PagedDto<TicketSummaryDto>>> getMyAssignedTickets(
            @AuthenticationPrincipal CustomUserProfileDetails currentUser,
            Pageable pageable) {
        Page<TicketSummaryDto> ticketPage = ticketService.findAllTicketsAssignedTo(currentUser.getId(), pageable);
        return ResponseEntity.ok(ApiResponse.ok("Ticket assegnati recuperati con successo.", new PagedDto<>(ticketPage)));
    }

    // GET /api/tickets/{id} -> Dettaglio di un singolo ticket
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('TICKET_READ_ALL') or @securityService.isOwnerOrAssignee(#id, principal.id)")
    public ResponseEntity<ApiResponse<TicketDetailDto>> getTicketById(@PathVariable Long id) {
        TicketDetailDto ticket = ticketService.findTicketById(id);
        return ResponseEntity.ok(ApiResponse.ok("Dettagli ticket recuperati.", ticket));
    }

    // POST /api/tickets -> Creazione di un nuovo ticket
    @PostMapping
    @PreAuthorize("hasAuthority('TICKET_CREATE')")
    public ResponseEntity<ApiResponse<TicketDetailDto>> createTicket(
            @Valid @RequestBody CreateTicketDto createTicketDto,
            @AuthenticationPrincipal CustomUserProfileDetails currentUser) {

        UserProfile user = getUserProfile(currentUser);
        TicketDetailDto createdTicket = ticketService.createTicket(createTicketDto, user);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest().path("/{id}")
                .buildAndExpand(createdTicket.getId()).toUri();

        return ResponseEntity.created(location).body(ApiResponse.created("Ticket creato con successo.", createdTicket));
    }

    // PUT /api/tickets/{id} -> Aggiornamento di un ticket esistente
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('TICKET_UPDATE_ALL') or @securityService.isOwnerOrAssignee(#id, principal.id)")
    public ResponseEntity<ApiResponse<TicketDetailDto>> updateTicket(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTicketDto updateTicketDto,
            @AuthenticationPrincipal CustomUserProfileDetails currentUser) {

        UserProfile user = getUserProfile(currentUser);
        TicketDetailDto updatedTicket = ticketService.updateTicket(id, updateTicketDto, user);

        return ResponseEntity.ok(ApiResponse.ok("Ticket aggiornato con successo.", updatedTicket));
    }

    // DELETE /api/tickets/{id} -> Eliminazione (soft delete) di un ticket
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('TICKET_DELETE')")
    public ResponseEntity<ApiResponse<Void>> deleteTicket(@PathVariable Long id) {
        ticketService.deleteTicket(id);
        return ResponseEntity.noContent().build(); // Restituisce 204 No Content
    }

    // POST /api/tickets/{id}/comments -> Aggiunge un commento
    @PostMapping("/{id}/comments")
    @PreAuthorize("hasAuthority('TICKET_COMMENT_ALL') or @securityService.canCommentOnTicket(#id, principal.id)")
    public ResponseEntity<ApiResponse<TicketDetailDto>> addComment(
            @PathVariable Long id,
            @Valid @RequestBody AddCommentDto addCommentDto,
            @AuthenticationPrincipal CustomUserProfileDetails currentUser) {

        UserProfile user = getUserProfile(currentUser);
        TicketDetailDto updatedTicket = ticketService.addComment(id, addCommentDto, user);
        return ResponseEntity.ok(ApiResponse.ok("Commento aggiunto con successo.", updatedTicket));
    }

    // PATCH /api/tickets/{id}/assign -> Assegna un ticket
    @PatchMapping("/{id}/assign")
    @PreAuthorize("hasAuthority('TICKET_ASSIGN')")
    public ResponseEntity<ApiResponse<TicketDetailDto>> assignTicket(
            @PathVariable Long id,
            @Valid @RequestBody AssignTicketDto assignTicketDto,
            @AuthenticationPrincipal CustomUserProfileDetails currentUser) {

        UserProfile user = getUserProfile(currentUser);
        TicketDetailDto updatedTicket = ticketService.assignTicket(id, assignTicketDto, user);
        return ResponseEntity.ok(ApiResponse.ok("Ticket assegnato con successo.", updatedTicket));
    }

    // PATCH /api/tickets/{id}/status -> Cambia lo stato
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAuthority('TICKET_STATUS_CHANGE')")
    public ResponseEntity<ApiResponse<TicketDetailDto>> changeStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTicketStatusDto statusDto,
            @AuthenticationPrincipal CustomUserProfileDetails currentUser) {

        UserProfile user = getUserProfile(currentUser);
        TicketDetailDto updatedTicket = ticketService.changeStatus(id, statusDto, user);
        return ResponseEntity.ok(ApiResponse.ok("Stato del ticket aggiornato.", updatedTicket));
    }

    // POST /api/tickets/{id}/attachments -> Aggiunge un allegato
    @PostMapping(value = "/{id}/attachments", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAuthority('TICKET_COMMENT_ALL') or @securityService.canCommentOnTicket(#id, principal.id)")
    public ResponseEntity<ApiResponse<TicketDetailDto>> addAttachment(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal CustomUserProfileDetails currentUser) {

        UserProfile user = getUserProfile(currentUser);
        TicketDetailDto updatedTicket = ticketService.addAttachment(id, file, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.created("Allegato aggiunto con successo.", updatedTicket));
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