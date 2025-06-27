package com.mrz1m.tickets.auth.dtos;

import lombok.Data;

@Data
public class UserDto {
    private Long id;
    private String email;
    private String displayName;
}