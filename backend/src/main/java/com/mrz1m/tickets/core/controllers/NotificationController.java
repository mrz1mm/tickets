package com.mrz1m.tickets.core.controllers;

import com.mrz1m.tickets.auth.security.CustomUserProfileDetails;
import com.mrz1m.tickets.core.entities.Notification;
import com.mrz1m.tickets.core.payloads.ApiResponse;
import com.mrz1m.tickets.core.services.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<Notification>>> getMyNotifications(
            @AuthenticationPrincipal CustomUserProfileDetails currentUser,
            Pageable pageable) {
        Page<Notification> notifications = notificationService.getMyNotifications(currentUser.getId(), pageable);
        return ResponseEntity.ok(ApiResponse.ok("Notifiche recuperate.", notifications));
    }

    @PostMapping("/mark-all-as-read")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(
            @AuthenticationPrincipal CustomUserProfileDetails currentUser) {
        notificationService.markAllAsRead(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.ok("Tutte le notifiche sono state segnate come lette.", null));
    }

    @PostMapping("/{id}/mark-as-read")
    public ResponseEntity<ApiResponse<Void>> markOneAsRead(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserProfileDetails currentUser) {
        notificationService.markAsRead(id, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.ok("Notifica segnata come letta.", null));
    }
}