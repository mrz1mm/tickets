package com.mrz1m.tickets.ticketing.dtos;

import com.mrz1m.tickets.auth.dtos.UserDto;
import com.mrz1m.tickets.ticketing.enums.HistoryEventType;
import lombok.Data;
import java.time.OffsetDateTime;

@Data
public class TicketHistoryDto {
    private Long id;
    private UserDto user;
    private HistoryEventType eventType;
    private String content;
    private OffsetDateTime createdAt;
}