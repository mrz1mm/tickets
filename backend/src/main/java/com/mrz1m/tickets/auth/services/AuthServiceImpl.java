package com.mrz1m.tickets.auth.services;

import com.mrz1m.tickets.auth.dtos.LoginDto;
import com.mrz1m.tickets.auth.dtos.AuthDto;
import com.mrz1m.tickets.auth.dtos.RegisterDto;
import com.mrz1m.tickets.auth.entities.Role;
import com.mrz1m.tickets.auth.entities.UserCredential;
import com.mrz1m.tickets.auth.entities.UserProfile;
import com.mrz1m.tickets.auth.enums.AuthProvider;
import com.mrz1m.tickets.auth.exceptions.UserAlreadyExistsException;
import com.mrz1m.tickets.auth.mappers.UserMapper;
import com.mrz1m.tickets.auth.repositories.RoleRepository;
import com.mrz1m.tickets.auth.repositories.UserRepository;
import com.mrz1m.tickets.auth.security.CustomUserProfileDetails;
import com.mrz1m.tickets.auth.security.JwtService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class AuthServiceImpl implements AuthService {
    @Autowired
    UserRepository userRepository;
    @Autowired
    RoleRepository roleRepository;
    @Autowired
    PasswordEncoder passwordEncoder;
    @Autowired
    JwtService jwtService;
    @Autowired
    AuthenticationManager authenticationManager;
    @Autowired
    UserMapper userMapper;

    @Override
    @Transactional
    public void register(RegisterDto request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new UserAlreadyExistsException("Un utente con l'email '" + request.getEmail() + "' esiste già.");
        }

        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new IllegalStateException("Ruolo ROLE_USER non trovato."));

        UserProfile newUserProfile = UserProfile.builder()
                .email(request.getEmail())
                .displayName(request.getDisplayName())
                .enabled(true)
                .roles(Set.of(userRole))
                .build();

        UserCredential credential = UserCredential.builder()
                .userProfile(newUserProfile)
                .provider(AuthProvider.LOCAL)
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        newUserProfile.getCredentials().add(credential);

        userRepository.save(newUserProfile);
    }

    @Override
    @Transactional(Transactional.TxType.NOT_SUPPORTED)
    public AuthDto login(LoginDto request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        CustomUserProfileDetails userDetails = (CustomUserProfileDetails) authentication.getPrincipal();
        String jwtToken = jwtService.generateToken(userDetails);

        // Costruiamo la risposta completa da passare al controller
        return AuthDto.builder()
                .accessToken(jwtToken)
                .userDetails(userMapper.toUserDetailDto(userDetails.getUserProfile()))
                .build();
    }
}