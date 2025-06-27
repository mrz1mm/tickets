package com.mrz1m.tickets.ticketing.mappers;

import com.mrz1m.tickets.ticketing.dtos.TicketAttachmentDto;
import com.mrz1m.tickets.ticketing.entities.TicketAttachment;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TicketAttachmentMapper {

    TicketAttachmentDto toTicketAttachmentDto(TicketAttachment attachment);

}