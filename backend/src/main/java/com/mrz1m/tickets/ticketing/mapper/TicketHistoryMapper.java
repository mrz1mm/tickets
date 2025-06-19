package com.mrz1m.tickets.ticketing.mapper;

import com.mrz1m.tickets.ticketing.dto.TicketHistoryDto;
import com.mrz1m.tickets.ticketing.entity.TicketHistory;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TicketHistoryMapper {

    TicketHistoryDto toTicketHistoryDto(TicketHistory ticketHistory);

}
