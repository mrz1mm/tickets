package com.mrz1m.tickets.auth.controller;

import com.mrz1m.tickets.auth.security.CustomUserProfileDetails;
import com.mrz1m.tickets.auth.service.UserPreferenceService;
import com.mrz1m.tickets.core.payload.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserPreferenceController {

    private final UserPreferenceService preferenceService;

    @PutMapping("/me/preferences")
    public ResponseEntity<ApiResponse<Void>> updateUserPreferences(
            @AuthenticationPrincipal CustomUserProfileDetails currentUser,
            @RequestBody Map<String, Object> preferences) {

        preferenceService.updatePreferences(currentUser.getId(), preferences);

        ApiResponse<Void> response = ApiResponse.ok("Preferenze aggiornate con successo.", null);
        return ResponseEntity.ok(response);
    }
}