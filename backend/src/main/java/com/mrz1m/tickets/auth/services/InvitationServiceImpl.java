package com.mrz1m.tickets.auth.services;

import com.mrz1m.tickets.auth.dtos.InviteRequestDto;
import com.mrz1m.tickets.auth.entities.UserProfile;
import com.mrz1m.tickets.auth.exceptions.UserAlreadyExistsException;
import com.mrz1m.tickets.auth.entities.Invitation;
import com.mrz1m.tickets.auth.repositories.InvitationRepository;
import com.mrz1m.tickets.ticketing.exceptions.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InvitationServiceImpl implements InvitationService {

    private final InvitationRepository invitationRepository;

    @Override
    @Transactional
    public void createAndSendInvitation(InviteRequestDto inviteRequest, UserProfile inviter) {
        if (invitationRepository.existsByEmailAndCompanyIdAndIsRegisteredFalse(inviteRequest.getEmail(), inviter.getCompany().getId())) {
            throw new UserAlreadyExistsException("Un invito per questa email è già stato inviato ed è ancora valido.");
        }

        String token = UUID.randomUUID().toString();

        Invitation invitation = Invitation.builder()
                .company(inviter.getCompany())
                .email(inviteRequest.getEmail())
                .token(token)
                .roleToAssign(inviteRequest.getRoleName())
                .expiresAt(OffsetDateTime.now().plusDays(7)) // Invito valido per 7 giorni
                .isRegistered(false)
                .build();

        invitationRepository.save(invitation);

        // TODO (Task 8): Chiamare EmailService per inviare l'email con il link
        System.out.println("INVITATION LINK (per ora in console): /register?token=" + token);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Invitation> getPendingInvitationsForCompany(UserProfile currentUser) {
        return invitationRepository.findByCompanyIdAndIsRegisteredFalseOrderByCreatedAtDesc(currentUser.getCompany().getId());
    }

    @Override
    @Transactional
    public void resendInvitation(Long invitationId, UserProfile currentUser) {
        Invitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new ResourceNotFoundException("Invitation", "id", invitationId));

        if (!invitation.getCompany().getId().equals(currentUser.getCompany().getId())) {
            throw new SecurityException("Accesso negato all'invito.");
        }

        invitation.setToken(UUID.randomUUID().toString());
        invitation.setExpiresAt(OffsetDateTime.now().plusDays(7));
        invitationRepository.save(invitation);

        // TODO (Task 8): Chiamare EmailService per inviare la nuova email
        System.out.println("NEW INVITATION LINK (per ora in console): /register?token=" + invitation.getToken());
    }

    @Override
    @Transactional
    public void cancelInvitation(Long invitationId, UserProfile currentUser) {
        Invitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new ResourceNotFoundException("Invitation", "id", invitationId));

        if (!invitation.getCompany().getId().equals(currentUser.getCompany().getId())) {
            throw new SecurityException("Accesso negato all'invito.");
        }

        invitationRepository.delete(invitation);
    }

    @Override
    public String validateAndGetEmail(String token) {
        return invitationRepository.findByTokenAndIsRegisteredFalse(token)
                .filter(inv -> inv.getExpiresAt().isAfter(OffsetDateTime.now()))
                .map(Invitation::getEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Invitation", "token", token));
    }
}