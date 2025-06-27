package com.mrz1m.tickets.ticketing.mappers;

import com.mrz1m.tickets.ticketing.dtos.TicketHistoryDto;
import com.mrz1m.tickets.ticketing.entities.TicketHistory;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TicketHistoryMapper {

    TicketHistoryDto toTicketHistoryDto(TicketHistory ticketHistory);

}
