package com.mrz1m.tickets.core.repositories;

import com.mrz1m.tickets.core.entities.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    Page<Notification> findByUserId(Long userId, Pageable pageable);

    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.user.id = :userId AND n.isRead = false")
    void markAllAsReadForUser(@Param("userId") Long userId);

    List<Notification> findAllByIsReadFalseAndIsDigestedFalse();

    @Modifying
    @Query("UPDATE Notification n SET n.isDigested = true WHERE n.id IN :ids")
    void markAsDigested(@Param("ids") List<Long> ids);
}