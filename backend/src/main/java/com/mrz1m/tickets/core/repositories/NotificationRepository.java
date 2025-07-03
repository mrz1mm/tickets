package com.mrz1m.tickets.core.repositories;

import com.mrz1m.tickets.core.entities.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    /**
     * Trova una pagina di notifiche per un utente specifico.
     * Grazie al filtro @Filter("tenantFilter") sull'entità Notification,
     * questa query sarà automaticamente ristretta anche all'azienda dell'utente.
     * @param userId L'ID dell'utente.
     * @param pageable Le informazioni per la paginazione.
     * @return Una pagina di notifiche.
     */
    Page<Notification> findByUserId(Long userId, Pageable pageable);

    /**
     * Segna tutte le notifiche non lette di un utente come lette.
     * L'operazione è ristretta all'utente specificato.
     * @param userId L'ID dell'utente.
     */
    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.user.id = :userId AND n.isRead = false")
    void markAllAsReadForUser(@Param("userId") Long userId);
}