package com.mrz1m.tickets.ticketing.dto;

import com.mrz1m.tickets.auth.dto.UserDto;
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