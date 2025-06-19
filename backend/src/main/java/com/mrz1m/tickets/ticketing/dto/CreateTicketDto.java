package com.mrz1m.tickets.ticketing.dto;

import com.mrz1m.tickets.ticketing.enums.TicketPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateTicketDto {
    @NotBlank(message = "Il titolo è obbligatorio")
    @Size(min = 5, max = 255)
    private String title;

    @NotBlank(message = "La descrizione è obbligatoria")
    @Size(min = 10)
    private String description;

    @NotNull(message = "L'ID del dipartimento è obbligatorio")
    private Long departmentId;

    @NotNull(message = "La priorità è obbligatoria")
    private TicketPriority priority;
}