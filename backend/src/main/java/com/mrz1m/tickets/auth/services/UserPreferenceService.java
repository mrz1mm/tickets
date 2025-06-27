package com.mrz1m.tickets.auth.services;

import com.mrz1m.tickets.auth.entities.UserProfile;
import com.mrz1m.tickets.auth.repositories.UserRepository;
import com.mrz1m.tickets.ticketing.exceptions.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserPreferenceService {

    private final UserRepository userRepository;

    @Transactional
    public void updatePreferences(Long userId, Map<String, Object> newPreferences) {
        UserProfile user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        user.getPreferences().putAll(newPreferences);
        userRepository.save(user);
    }
}