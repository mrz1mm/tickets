package com.mrz1m.tickets.auth.services;

import com.mrz1m.tickets.auth.dtos.AuthDto;
import com.mrz1m.tickets.auth.dtos.LoginDto;
import com.mrz1m.tickets.auth.dtos.RegisterDto;

public interface AuthService {
    void register(RegisterDto request);
    AuthDto login(LoginDto request);
}