package com.mrz1m.tickets.core.services;

public interface ActiveUserService {
    void userConnected(String username);
    void userDisconnected(String username);
    boolean isUserActive(String username);
}