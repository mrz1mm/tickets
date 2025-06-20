package com.mrz1m.tickets.auth.service;

import com.mrz1m.tickets.auth.entity.UserProfile;
import com.mrz1m.tickets.auth.repository.UserRepository;
import com.mrz1m.tickets.ticketing.exception.ResourceNotFoundException;
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