package com.mrz1m.tickets.core.schedulers;

import com.mrz1m.tickets.core.entities.Notification;
import com.mrz1m.tickets.core.repositories.NotificationRepository;
import com.mrz1m.tickets.core.services.ActiveUserService;
import com.mrz1m.tickets.core.services.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class EmailDigestScheduler {

    private final NotificationRepository notificationRepository;
    private final ActiveUserService activeUserService;
    private final EmailService emailService;

    // Esegui alle 9:00 e alle 14:00, dal lunedì al venerdì
    @Scheduled(cron = "0 0 9,14 * * MON-FRI")
    @Transactional
    public void sendEmailDigests() {
        log.info("Avvio del job per l'invio del digest email...");

        // 1. Trova tutte le notifiche non lette e non ancora incluse in un digest
        List<Notification> notificationsToSend = notificationRepository.findAllByIsReadFalseAndIsDigestedFalse();

        if (notificationsToSend.isEmpty()) {
            log.info("Nessuna nuova notifica da inviare. Job terminato.");
            return;
        }

        // 2. Raggruppa le notifiche per utente
        Map<String, List<Notification>> notificationsByUser = notificationsToSend.stream()
                .collect(Collectors.groupingBy(n -> n.getUser().getEmail()));

        // 3. Itera su ogni utente e invia il digest se non è attivo
        notificationsByUser.forEach((userEmail, userNotifications) -> {
            if (!activeUserService.isUserActive(userEmail)) {
                log.info("L'utente {} non è attivo, preparando il digest...", userEmail);

                // Invia l'email di riepilogo
                Map<String, Object> templateModel = Map.of(
                        "userName", userNotifications.get(0).getUser().getDisplayName(),
                        "notifications", userNotifications,
                        "notificationCount", userNotifications.size()
                );
                emailService.sendHtmlEmail(userEmail, "Riepilogo delle tue notifiche", "digest", templateModel);

                // 4. Segna le notifiche come "digerite"
                List<Long> notificationIds = userNotifications.stream().map(Notification::getId).toList();
                markNotificationsAsDigested(notificationIds);
            } else {
                log.info("L'utente {} è attualmente attivo, il digest verrà inviato in un secondo momento.", userEmail);
            }
        });

        log.info("Job di invio digest email terminato.");
    }

    @Modifying
    public void markNotificationsAsDigested(List<Long> ids) {
        notificationRepository.markAsDigested(ids);
    }
}