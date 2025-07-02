package com.mrz1m.tickets.auth.controllers;

import com.mrz1m.tickets.auth.dtos.InviteRequestDto;
import com.mrz1m.tickets.auth.security.CustomUserProfileDetails;
import com.mrz1m.tickets.auth.services.InvitationService;
import com.mrz1m.tickets.core.payloads.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final InvitationService invitationService;

    @PostMapping("/invitations")
    @PreAuthorize("hasAuthority('USER_CREATE')")
    public ResponseEntity<ApiResponse<Void>> inviteUser(
            @Valid @RequestBody InviteRequestDto inviteRequest,
            @AuthenticationPrincipal CustomUserProfileDetails currentUser) {
        invitationService.createAndSendInvitation(inviteRequest, currentUser.getUserProfile());
        return ResponseEntity.ok(ApiResponse.ok("Invito inviato con successo a " + inviteRequest.getEmail(), null));
    }
}