package com.mrz1m.tickets.core.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateCompanyDto {
    @NotBlank(message = "Il nome dell'azienda è obbligatorio.")
    @Size(min = 3, max = 255)
    private String name;
}