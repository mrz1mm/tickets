package com.mrz1m.tickets.ticketing.dtos;

import com.mrz1m.tickets.auth.dtos.UserDto;
import com.mrz1m.tickets.ticketing.enums.TicketPriority;
import com.mrz1m.tickets.ticketing.enums.TicketStatus;
import lombok.Data;
import java.time.OffsetDateTime;

@Data
public class TicketSummaryDto {
    private Long id;
    private String title;
    private TicketStatus status;
    private TicketPriority priority;
    private UserDto requester;
    private UserDto assignee;
    private DepartmentDto department;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}