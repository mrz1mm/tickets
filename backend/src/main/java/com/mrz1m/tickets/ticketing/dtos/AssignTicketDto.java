package com.mrz1m.tickets.ticketing.dtos;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AssignTicketDto {
    @NotNull(message = "L'ID dell'utente a cui assegnare il ticket è obbligatorio")
    private Long assigneeId;
}