package com.mrz1m.tickets.auth.controller;

import com.mrz1m.tickets.auth.dto.AuthDto;
import com.mrz1m.tickets.auth.dto.LoginDto;
import com.mrz1m.tickets.auth.dto.RegisterDto;
import com.mrz1m.tickets.auth.dto.UserDetailDto;
import com.mrz1m.tickets.auth.entity.UserProfile;
import com.mrz1m.tickets.auth.mapper.UserMapper;
import com.mrz1m.tickets.auth.security.CustomUserProfileDetails;
import com.mrz1m.tickets.auth.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserMapper userMapper;

    @Value("${jwt.expiration-ms}")
    private long jwtExpirationMs;

    @PostMapping("/register")
    public ResponseEntity<Void> register(@Valid @RequestBody RegisterDto request) {
        authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/login")
    public ResponseEntity<UserDetailDto> login(
            @Valid @RequestBody LoginDto request,
            HttpServletResponse response
    ) {
        AuthDto loginResponse = authService.login(request);

        // 1. Crea il cookie HTTP-Only con il JWT
        Cookie jwtCookie = new Cookie("accessToken", loginResponse.getAccessToken());
        jwtCookie.setHttpOnly(true);   // Fondamentale: impedisce l'accesso da JavaScript (protezione XSS)
        jwtCookie.setSecure(true);     // Invia il cookie solo su connessioni HTTPS
        jwtCookie.setPath("/");        // Rende il cookie disponibile per l'intera applicazione

        // 2. Imposta la durata del cookie uguale a quella del token JWT
        long expiresInSeconds = TimeUnit.MILLISECONDS.toSeconds(jwtExpirationMs);
        jwtCookie.setMaxAge((int) expiresInSeconds);

        // 3. Aggiungi il cookie alla risposta
        response.addCookie(jwtCookie);

        // 4. Restituisci i dettagli dell'utente nel corpo della risposta JSON
        return ResponseEntity.ok(loginResponse.getUserDetails());
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        // Per fare il logout, inviamo un cookie con lo stesso nome ma con durata 0
        Cookie cookie = new Cookie("accessToken", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(0); // Dice al browser di cancellare il cookie immediatamente

        response.addCookie(cookie);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/me")
    public ResponseEntity<UserDetailDto> getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (principal instanceof CustomUserProfileDetails currentUserDetails) {
            UserProfile userProfile = currentUserDetails.getUserProfile();
            return ResponseEntity.ok(userMapper.toUserDetailDto(userProfile));
        }

        // Se il principal non è quello atteso (es. utente non autenticato, token non valido),
        // restituiamo 401 Unauthorized invece di un errore generico.
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
}