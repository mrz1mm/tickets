package com.mrz1m.tickets.ticketing.mappers;

import com.mrz1m.tickets.auth.dtos.UserDto;
import com.mrz1m.tickets.auth.entities.UserProfile;
import com.mrz1m.tickets.ticketing.dtos.TicketHistoryDto;
import com.mrz1m.tickets.ticketing.entities.TicketHistory;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-06-27T17:01:55+0200",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 24.0.1 (Oracle Corporation)"
)
@Component
public class TicketHistoryMapperImpl implements TicketHistoryMapper {

    @Override
    public TicketHistoryDto toTicketHistoryDto(TicketHistory ticketHistory) {
        if ( ticketHistory == null ) {
            return null;
        }

        TicketHistoryDto ticketHistoryDto = new TicketHistoryDto();

        ticketHistoryDto.setId( ticketHistory.getId() );
        ticketHistoryDto.setUser( userProfileToUserDto( ticketHistory.getUser() ) );
        ticketHistoryDto.setEventType( ticketHistory.getEventType() );
        ticketHistoryDto.setContent( ticketHistory.getContent() );
        ticketHistoryDto.setCreatedAt( ticketHistory.getCreatedAt() );

        return ticketHistoryDto;
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
