package com.mrz1m.tickets.core.services;

import com.mrz1m.tickets.core.entities.Notification;
import com.mrz1m.tickets.core.repositories.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationRepository notificationRepository;

    @Override
    public void notifyUser(String userId, String destination, Object payload) {
        messagingTemplate.convertAndSendToUser(userId, destination, payload);
    }

    @Override
    public void notifyTopic(String destination, Object payload) {
        messagingTemplate.convertAndSend(destination, payload);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Notification> getMyNotifications(Long userId, Pageable pageable) {
        return notificationRepository.findByUserId(userId, pageable);
    }

    @Override
    @Transactional
    public void markAllAsRead(Long userId) {
        notificationRepository.markAllAsReadForUser(userId);
    }

    @Override
    @Transactional
    public void markAsRead(Long notificationId, Long userId) {
        notificationRepository.findById(notificationId).ifPresent(notification -> {
            if (!notification.getUser().getId().equals(userId)) {
                throw new AccessDeniedException("Non puoi modificare notifiche di altri utenti.");
            }
            notification.setRead(true);
            notificationRepository.save(notification);
        });
    }
}