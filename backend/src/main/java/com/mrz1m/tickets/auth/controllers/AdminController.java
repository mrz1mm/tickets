package com.mrz1m.tickets.auth.controllers;

import com.mrz1m.tickets.auth.dtos.InviteRequestDto;
import com.mrz1m.tickets.auth.dtos.UserDetailDto;
import com.mrz1m.tickets.auth.security.CustomUserProfileDetails;
import com.mrz1m.tickets.auth.services.InvitationService;
import com.mrz1m.tickets.auth.services.UserService;
import com.mrz1m.tickets.core.payloads.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final InvitationService invitationService;
    private final UserService userService;

    @GetMapping("/users")
    @PreAuthorize("hasAuthority('USER_READ')")
    public ResponseEntity<ApiResponse<Page<UserDetailDto>>> getCompanyUsers(Pageable pageable) {
        Page<UserDetailDto> users = userService.getUsersForCurrentCompany(pageable);
        return ResponseEntity.ok(ApiResponse.ok("Utenti dell'azienda recuperati con successo.", users));
    }

    @PostMapping("/invitations")
    @PreAuthorize("hasAuthority('USER_CREATE')")
    public ResponseEntity<ApiResponse<Void>> inviteUser(
            @Valid @RequestBody InviteRequestDto inviteRequest,
            @AuthenticationPrincipal CustomUserProfileDetails currentUser) {
        invitationService.createAndSendInvitation(inviteRequest, currentUser.getUserProfile());
        return ResponseEntity.ok(ApiResponse.ok("Invito inviato con successo a " + inviteRequest.getEmail(), null));
    }
}