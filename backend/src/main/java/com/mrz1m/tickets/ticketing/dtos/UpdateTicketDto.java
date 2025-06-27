package com.mrz1m.tickets.ticketing.dtos;

import com.mrz1m.tickets.ticketing.enums.TicketPriority;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateTicketDto {
    @Size(min = 5, max = 255)
    private String title;

    @Size(min = 10)
    private String description;

    private Long departmentId;
    private TicketPriority priority;
}