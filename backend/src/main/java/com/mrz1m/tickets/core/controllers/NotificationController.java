package com.mrz1m.tickets.core.controllers;

import com.mrz1m.tickets.auth.security.CustomUserProfileDetails;
import com.mrz1m.tickets.core.entities.Notification;
import com.mrz1m.tickets.core.payloads.ApiResponse;
import com.mrz1m.tickets.core.repositories.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationRepository notificationRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<Notification>>> getMyNotifications(
            @AuthenticationPrincipal CustomUserProfileDetails currentUser,
            Pageable pageable) {
        Page<Notification> notifications = notificationRepository.findByUserId(currentUser.getId(), pageable);
        return ResponseEntity.ok(ApiResponse.ok("Notifiche recuperate.", notifications));
    }

    @PostMapping("/mark-all-as-read")
    @Transactional
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(
            @AuthenticationPrincipal CustomUserProfileDetails currentUser) {
        notificationRepository.markAllAsReadForUser(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.ok("Tutte le notifiche sono state segnate come lette.", null));
    }

    @PostMapping("/{id}/mark-as-read")
    @Transactional
    public ResponseEntity<ApiResponse<Void>> markOneAsRead(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserProfileDetails currentUser) {
        notificationRepository.findById(id).ifPresent(notification -> {
            // Assicuriamoci che l'utente possa modificare solo le proprie notifiche
            if (notification.getUser().getId().equals(currentUser.getId())) {
                notification.setRead(true);
                notificationRepository.save(notification);
            }
        });
        return ResponseEntity.ok(ApiResponse.ok("Notifica segnata come letta.", null));
    }
}