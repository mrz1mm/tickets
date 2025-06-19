package com.mrz1m.tickets.auth.service;

import com.mrz1m.tickets.auth.dto.AuthDto;
import com.mrz1m.tickets.auth.dto.LoginDto;
import com.mrz1m.tickets.auth.dto.RegisterDto;

public interface AuthService {
    void register(RegisterDto request);
    AuthDto login(LoginDto request);
}