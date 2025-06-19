package com.mrz1m.tickets.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginDto {
    @NotBlank(message = "L'email non può essere vuota")
    @Email(message = "Formato email non valido")
    private String email;

    @NotBlank(message = "La password non può essere vuota")
    private String password;
}