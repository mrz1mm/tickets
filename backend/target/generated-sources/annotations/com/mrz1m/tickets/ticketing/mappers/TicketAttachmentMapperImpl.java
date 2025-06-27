package com.mrz1m.tickets.ticketing.mappers;

import com.mrz1m.tickets.auth.dtos.UserDto;
import com.mrz1m.tickets.auth.entities.UserProfile;
import com.mrz1m.tickets.ticketing.dtos.TicketAttachmentDto;
import com.mrz1m.tickets.ticketing.entities.TicketAttachment;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-06-27T17:01:55+0200",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 24.0.1 (Oracle Corporation)"
)
@Component
public class TicketAttachmentMapperImpl implements TicketAttachmentMapper {

    @Override
    public TicketAttachmentDto toTicketAttachmentDto(TicketAttachment attachment) {
        if ( attachment == null ) {
            return null;
        }

        TicketAttachmentDto ticketAttachmentDto = new TicketAttachmentDto();

        ticketAttachmentDto.setId( attachment.getId() );
        ticketAttachmentDto.setFileName( attachment.getFileName() );
        ticketAttachmentDto.setMimeType( attachment.getMimeType() );
        ticketAttachmentDto.setFileSizeBytes( attachment.getFileSizeBytes() );
        ticketAttachmentDto.setUploader( userProfileToUserDto( attachment.getUploader() ) );
        ticketAttachmentDto.setCreatedAt( attachment.getCreatedAt() );

        return ticketAttachmentDto;
    }

    protected UserDto userProfileToUserDto(UserProfile userProfile) {
        if ( userProfile == null ) {
            return null;
        }

        UserDto userDto = new UserDto();

        userDto.setId( userProfile.getId() );
        userDto.setEmail( userProfile.getEmail() );
        userDto.setDisplayName( userProfile.getDisplayName() );

        return userDto;
    }
}
