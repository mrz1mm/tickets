package com.mrz1m.tickets.ticketing.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateDepartmentDto(
        @NotBlank(message = "Il nome del dipartimento non può essere vuoto.")
        @Size(max = 100, message = "Il nome non può superare i 100 caratteri.")
        String name,

        @Size(max = 255, message = "La descrizione non può superare i 255 caratteri.")
        String description
) {}