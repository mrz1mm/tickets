package com.mrz1m.tickets.core.services;

import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import java.util.Collections;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ActiveUserServiceImpl implements ActiveUserService {

    private final Set<String> activeUsers = Collections.newSetFromMap(new ConcurrentHashMap<>());

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        StompHeaderAccessor headers = StompHeaderAccessor.wrap(event.getMessage());
        if (headers.getUser() != null) {
            String username = headers.getUser().getName();
            activeUsers.add(username);
        }
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headers = StompHeaderAccessor.wrap(event.getMessage());
        if (headers.getUser() != null) {
            String username = headers.getUser().getName();
            activeUsers.remove(username);
        }
    }

    @Override
    public boolean isUserActive(String username) {
        return activeUsers.contains(username);
    }

    @Override
    public void userConnected(String username) {}

    @Override
    public void userDisconnected(String username) {}
}