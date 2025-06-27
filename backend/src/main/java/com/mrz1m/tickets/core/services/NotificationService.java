package com.mrz1m.tickets.core.services;

public interface NotificationService {

    /**
     * Invia un messaggio a una destinazione privata di un utente specifico.
     * @param userId L'ID dell'utente da notificare.
     * @param destination Il path della coda (es. "/queue/notifications").
     * @param payload L'oggetto da inviare come messaggio.
     */
    void notifyUser(String userId, String destination, Object payload);

    /**
     * Invia un messaggio a un topic pubblico.
     * @param destination Il path del topic (es. "/topic/admin-notifications").
     * @param payload L'oggetto da inviare come messaggio.
     */
    void notifyTopic(String destination, Object payload);
}