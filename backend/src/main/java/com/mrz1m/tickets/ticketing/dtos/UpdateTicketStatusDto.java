package com.mrz1m.tickets.ticketing.dtos;

import com.mrz1m.tickets.ticketing.enums.TicketStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateTicketStatusDto {
    @NotNull(message = "Il nuovo stato del ticket è obbligatorio")
    private TicketStatus status;
}