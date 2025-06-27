package com.mrz1m.tickets.ticketing.mapper;

import com.mrz1m.tickets.auth.dto.UserDto;
import com.mrz1m.tickets.auth.entity.UserProfile;
import com.mrz1m.tickets.ticketing.dto.TicketHistoryDto;
import com.mrz1m.tickets.ticketing.entity.TicketHistory;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-06-27T16:18:01+0200",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.6 (OpenLogic)"
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
