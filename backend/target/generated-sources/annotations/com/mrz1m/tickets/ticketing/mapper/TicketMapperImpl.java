package com.mrz1m.tickets.ticketing.mapper;

import com.mrz1m.tickets.auth.dto.UserDto;
import com.mrz1m.tickets.auth.entity.UserProfile;
import com.mrz1m.tickets.ticketing.dto.CreateTicketDto;
import com.mrz1m.tickets.ticketing.dto.DepartmentDto;
import com.mrz1m.tickets.ticketing.dto.TicketAttachmentDto;
import com.mrz1m.tickets.ticketing.dto.TicketDetailDto;
import com.mrz1m.tickets.ticketing.dto.TicketHistoryDto;
import com.mrz1m.tickets.ticketing.dto.TicketSummaryDto;
import com.mrz1m.tickets.ticketing.entity.Department;
import com.mrz1m.tickets.ticketing.entity.Ticket;
import com.mrz1m.tickets.ticketing.entity.TicketAttachment;
import com.mrz1m.tickets.ticketing.entity.TicketHistory;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-06-27T16:18:01+0200",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.6 (OpenLogic)"
)
@Component
public class TicketMapperImpl implements TicketMapper {

    @Override
    public TicketSummaryDto toTicketSummaryDto(Ticket ticket) {
        if ( ticket == null ) {
            return null;
        }

        TicketSummaryDto ticketSummaryDto = new TicketSummaryDto();

        ticketSummaryDto.setId( ticket.getId() );
        ticketSummaryDto.setTitle( ticket.getTitle() );
        ticketSummaryDto.setStatus( ticket.getStatus() );
        ticketSummaryDto.setPriority( ticket.getPriority() );
        ticketSummaryDto.setRequester( userProfileToUserDto( ticket.getRequester() ) );
        ticketSummaryDto.setAssignee( userProfileToUserDto( ticket.getAssignee() ) );
        ticketSummaryDto.setDepartment( departmentToDepartmentDto( ticket.getDepartment() ) );
        ticketSummaryDto.setCreatedAt( ticket.getCreatedAt() );
        ticketSummaryDto.setUpdatedAt( ticket.getUpdatedAt() );

        return ticketSummaryDto;
    }

    @Override
    public TicketDetailDto toTicketDetailDto(Ticket ticket) {
        if ( ticket == null ) {
            return null;
        }

        TicketDetailDto ticketDetailDto = new TicketDetailDto();

        ticketDetailDto.setId( ticket.getId() );
        ticketDetailDto.setTitle( ticket.getTitle() );
        ticketDetailDto.setDescription( ticket.getDescription() );
        ticketDetailDto.setStatus( ticket.getStatus() );
        ticketDetailDto.setPriority( ticket.getPriority() );
        ticketDetailDto.setRequester( userProfileToUserDto( ticket.getRequester() ) );
        ticketDetailDto.setAssignee( userProfileToUserDto( ticket.getAssignee() ) );
        ticketDetailDto.setDepartment( departmentToDepartmentDto( ticket.getDepartment() ) );
        ticketDetailDto.setCreatedAt( ticket.getCreatedAt() );
        ticketDetailDto.setUpdatedAt( ticket.getUpdatedAt() );
        ticketDetailDto.setHistory( ticketHistoryListToTicketHistoryDtoList( ticket.getHistory() ) );
        ticketDetailDto.setAttachments( ticketAttachmentListToTicketAttachmentDtoList( ticket.getAttachments() ) );

        return ticketDetailDto;
    }

    @Override
    public Ticket toTicketEntity(CreateTicketDto createTicketDto) {
        if ( createTicketDto == null ) {
            return null;
        }

        Ticket.TicketBuilder ticket = Ticket.builder();

        ticket.title( createTicketDto.getTitle() );
        ticket.description( createTicketDto.getDescription() );
        ticket.priority( createTicketDto.getPriority() );

        return ticket.build();
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

    protected DepartmentDto departmentToDepartmentDto(Department department) {
        if ( department == null ) {
            return null;
        }

        DepartmentDto departmentDto = new DepartmentDto();

        departmentDto.setId( department.getId() );
        departmentDto.setName( department.getName() );
        departmentDto.setDescription( department.getDescription() );

        return departmentDto;
    }

    protected TicketHistoryDto ticketHistoryToTicketHistoryDto(TicketHistory ticketHistory) {
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

    protected List<TicketHistoryDto> ticketHistoryListToTicketHistoryDtoList(List<TicketHistory> list) {
        if ( list == null ) {
            return null;
        }

        List<TicketHistoryDto> list1 = new ArrayList<TicketHistoryDto>( list.size() );
        for ( TicketHistory ticketHistory : list ) {
            list1.add( ticketHistoryToTicketHistoryDto( ticketHistory ) );
        }

        return list1;
    }

    protected TicketAttachmentDto ticketAttachmentToTicketAttachmentDto(TicketAttachment ticketAttachment) {
        if ( ticketAttachment == null ) {
            return null;
        }

        TicketAttachmentDto ticketAttachmentDto = new TicketAttachmentDto();

        ticketAttachmentDto.setId( ticketAttachment.getId() );
        ticketAttachmentDto.setFileName( ticketAttachment.getFileName() );
        ticketAttachmentDto.setMimeType( ticketAttachment.getMimeType() );
        ticketAttachmentDto.setFileSizeBytes( ticketAttachment.getFileSizeBytes() );
        ticketAttachmentDto.setUploader( userProfileToUserDto( ticketAttachment.getUploader() ) );
        ticketAttachmentDto.setCreatedAt( ticketAttachment.getCreatedAt() );

        return ticketAttachmentDto;
    }

    protected List<TicketAttachmentDto> ticketAttachmentListToTicketAttachmentDtoList(List<TicketAttachment> list) {
        if ( list == null ) {
            return null;
        }

        List<TicketAttachmentDto> list1 = new ArrayList<TicketAttachmentDto>( list.size() );
        for ( TicketAttachment ticketAttachment : list ) {
            list1.add( ticketAttachmentToTicketAttachmentDto( ticketAttachment ) );
        }

        return list1;
    }
}
