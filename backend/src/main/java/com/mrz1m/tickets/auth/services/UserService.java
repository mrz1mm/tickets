package com.mrz1m.tickets.auth.services;

import com.mrz1m.tickets.auth.dtos.UserDetailDto;
import com.mrz1m.tickets.auth.entities.UserProfile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {
    Page<UserDetailDto> getUsersForCurrentCompany(Pageable pageable);
    UserProfile getActiveUserProfile(Long userId);
}