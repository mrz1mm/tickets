package com.mrz1m.tickets.auth.services;

import com.mrz1m.tickets.auth.dtos.UserDetailDto;
import com.mrz1m.tickets.auth.entities.UserProfile;
import com.mrz1m.tickets.auth.mappers.UserMapper;
import com.mrz1m.tickets.auth.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Override
    @Transactional(readOnly = true)
    public Page<UserDetailDto> getUsersForCurrentCompany(Pageable pageable) {
        return userRepository.findAll(pageable)
                .map(userMapper::toUserDetailDto);
    }

    @Override
    @Transactional(readOnly = true)
    public UserProfile getActiveUserProfile(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalStateException("Utente autenticato non trovato nel database con ID: " + userId));
    }
}