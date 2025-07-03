package com.mrz1m.tickets.core.services;

import com.mrz1m.tickets.core.entities.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface NotificationService {

    void notifyUser(String userId, String destination, Object payload);
    void notifyTopic(String destination, Object payload);
    Page<Notification> getMyNotifications(Long userId, Pageable pageable);
    void markAllAsRead(Long userId);
    void markAsRead(Long notificationId, Long userId);
}