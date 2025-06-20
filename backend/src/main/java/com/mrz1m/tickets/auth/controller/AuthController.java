package com.mrz1m.tickets.auth.controller;

import com.mrz1m.tickets.auth.dto.AuthDto;
import com.mrz1m.tickets.auth.dto.LoginDto;
import com.mrz1m.tickets.auth.dto.RegisterDto;
import com.mrz1m.tickets.auth.dto.UserDetailDto;
import com.mrz1m.tickets.auth.entity.UserProfile;
import com.mrz1m.tickets.auth.mapper.UserMapper;
import com.mrz1m.tickets.auth.security.CustomUserProfileDetails;
import com.mrz1m.tickets.auth.service.AuthService;
import com.mrz1m.tickets.core.payload.ApiResponse; // Importa
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<ApiResponse<Void>> register(@Valid @RequestBody RegisterDto request) {
        authService.register(request);
        ApiResponse<Void> response = ApiResponse.created("Utente registrato con successo. Effettua il login.", null);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<UserDetailDto>> login(@Valid @RequestBody LoginDto request, HttpServletResponse response) {
        AuthDto loginResponse = authService.login(request);
        Cookie jwtCookie = new Cookie("accessToken", loginResponse.getAccessToken());
        jwtCookie.setHttpOnly(true);
        jwtCookie.setSecure(true);
        jwtCookie.setPath("/");
        long expiresInSeconds = TimeUnit.MILLISECONDS.toSeconds(jwtExpirationMs);
        jwtCookie.setMaxAge((int) expiresInSeconds);
        response.addCookie(jwtCookie);

        ApiResponse<UserDetailDto> apiResponse = ApiResponse.ok("Login effettuato con successo.", loginResponse.getUserDetails());
        return ResponseEntity.ok(apiResponse);
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("accessToken", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
        ApiResponse<Void> apiResponse = ApiResponse.ok("Logout effettuato con successo.", null);
        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDetailDto>> getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (principal instanceof CustomUserProfileDetails currentUserDetails) {
            UserProfile userProfile = currentUserDetails.getUserProfile();
            UserDetailDto userDto = userMapper.toUserDetailDto(userProfile);
            ApiResponse<UserDetailDto> response = ApiResponse.ok("Dati utente recuperati.", userDto);
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error(401, "Unauthorized", "Token non valido o mancante.", null));
    }
}