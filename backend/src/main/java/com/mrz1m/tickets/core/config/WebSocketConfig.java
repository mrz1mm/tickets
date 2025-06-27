package com.mrz1m.tickets.core.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Prefissi per i messaggi diretti dal server ai client (topics, code private)
        config.enableSimpleBroker("/topic", "/user");
        // Prefisso per i messaggi diretti dal client al server (per i @MessageMapping)
        config.setApplicationDestinationPrefixes("/app");
        // Prefisso per le code utente (es. /user/{username}/queue/...)
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Endpoint a cui i client si connetteranno per stabilire la sessione WebSocket
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*") // Per lo sviluppo, altrimenti specifica l'URL del frontend
                .withSockJS(); // Fallback per browser che non supportano WebSocket nativamente
    }
}