package com.mrz1m.tickets.ticketing.mapper;

import com.mrz1m.tickets.ticketing.dto.CreateTicketDto;
import com.mrz1m.tickets.ticketing.dto.TicketDetailDto;
import com.mrz1m.tickets.ticketing.dto.TicketSummaryDto;
import com.mrz1m.tickets.ticketing.entity.Ticket;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TicketMapper {

    TicketSummaryDto toTicketSummaryDto(Ticket ticket);
    TicketDetailDto toTicketDetailDto(Ticket ticket);
    Ticket toTicketEntity(CreateTicketDto createTicketDto);
}