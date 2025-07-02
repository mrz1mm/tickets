package com.mrz1m.tickets.auth.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class InviteRequestDto {
    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String roleName;
}