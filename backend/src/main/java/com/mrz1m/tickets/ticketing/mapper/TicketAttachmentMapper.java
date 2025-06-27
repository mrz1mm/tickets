package com.mrz1m.tickets.ticketing.mapper;

import com.mrz1m.tickets.ticketing.dto.TicketAttachmentDto;
import com.mrz1m.tickets.ticketing.entity.TicketAttachment;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TicketAttachmentMapper {

    TicketAttachmentDto toTicketAttachmentDto(TicketAttachment attachment);

}