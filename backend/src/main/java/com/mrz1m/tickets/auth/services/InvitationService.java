package com.mrz1m.tickets.auth.services;

import com.mrz1m.tickets.auth.dtos.InviteRequestDto;
import com.mrz1m.tickets.auth.entities.UserProfile;
import com.mrz1m.tickets.auth.exceptions.UserAlreadyExistsException;
import com.mrz1m.tickets.auth.entities.Invitation;
import com.mrz1m.tickets.auth.repositories.InvitationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.OffsetDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InvitationService {

    private final InvitationRepository invitationRepository;

    @Transactional
    public void createAndSendInvitation(InviteRequestDto inviteRequest, UserProfile inviter) {
        if (invitationRepository.existsByEmailAndCompanyIdAndIsRegisteredFalse(inviteRequest.getEmail(), inviter.getCompany().getId())) {
            throw new UserAlreadyExistsException("Un invito per questa email è già stato inviato.");
        }

        String token = UUID.randomUUID().toString();

        Invitation invitation = Invitation.builder()
                .company(inviter.getCompany())
                .email(inviteRequest.getEmail())
                .token(token)
                .roleToAssign(inviteRequest.getRoleName())
                .expiresAt(OffsetDateTime.now().plusDays(7))
                .isRegistered(false)
                .build();

        invitationRepository.save(invitation);

        System.out.println("INVITATION LINK (per ora in console): /register?token=" + token);
    }
}