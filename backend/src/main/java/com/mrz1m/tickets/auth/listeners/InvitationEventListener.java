package com.mrz1m.tickets.auth.listeners;

import com.mrz1m.tickets.auth.entities.Invitation;
import com.mrz1m.tickets.auth.events.InvitationCreatedEvent;
import com.mrz1m.tickets.core.services.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class InvitationEventListener {

    private final EmailService emailService;

    @EventListener
    public void handleInvitationCreated(InvitationCreatedEvent event) {
        Invitation invitation = event.getInvitation();

        String frontendBaseUrl = "http://localhost:4200";
        String registrationLink = frontendBaseUrl + "/register?token=" + invitation.getToken();

        Map<String, Object> templateModel = Map.of(
                "name", invitation.getEmail(),
                "companyName", invitation.getCompany().getName(),
                "invitationLink", registrationLink
        );

        emailService.sendHtmlEmail(
                invitation.getEmail(),
                "Sei stato invitato a Tickets Platform!",
                "invitation",
                templateModel
        );
    }
}