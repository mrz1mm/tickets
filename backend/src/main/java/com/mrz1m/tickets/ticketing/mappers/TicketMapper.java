package com.mrz1m.tickets.ticketing.mappers;

import com.mrz1m.tickets.ticketing.dtos.CreateTicketDto;
import com.mrz1m.tickets.ticketing.dtos.TicketDetailDto;
import com.mrz1m.tickets.ticketing.dtos.TicketSummaryDto;
import com.mrz1m.tickets.ticketing.entities.Ticket;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TicketMapper {

    TicketSummaryDto toTicketSummaryDto(Ticket ticket);
    TicketDetailDto toTicketDetailDto(Ticket ticket);
    Ticket toTicketEntity(CreateTicketDto createTicketDto);
}