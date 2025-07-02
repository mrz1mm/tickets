package com.mrz1m.tickets.auth.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterDto {
    @NotBlank
    private String token;

    @NotBlank
    @Size(min = 3, max = 50)
    private String displayName;

    @NotBlank
    @Size(min = 8, message = "La password deve contenere almeno 8 caratteri")
    private String password;
}