package com.mrz1m.tickets.auth.services;

import com.mrz1m.tickets.auth.dtos.InviteRequestDto;
import com.mrz1m.tickets.auth.entities.Invitation;
import com.mrz1m.tickets.auth.entities.UserProfile;
import java.util.List;
public interface InvitationService {
    void createAndSendInvitation(InviteRequestDto inviteRequest, UserProfile inviter);
    List<Invitation> getPendingInvitationsForCompany(UserProfile currentUser);
    void resendInvitation(Long invitationId, UserProfile currentUser);
    void cancelInvitation(Long invitationId, UserProfile currentUser);
    String validateAndGetEmail(String token);
}