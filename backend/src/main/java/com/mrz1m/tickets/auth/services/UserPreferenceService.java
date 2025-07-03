package com.mrz1m.tickets.auth.services;

import java.util.Map;

public interface UserPreferenceService {
    void updatePreferences(Long userId, Map<String, Object> newPreferences);
}