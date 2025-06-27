package com.mrz1m.tickets.auth.mapper;

import com.mrz1m.tickets.auth.dto.PermissionDto;
import com.mrz1m.tickets.auth.entity.Permission;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-06-27T16:18:01+0200",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.6 (OpenLogic)"
)
@Component
public class PermissionMapperImpl implements PermissionMapper {

    @Override
    public PermissionDto toPermissionDto(Permission permission) {
        if ( permission == null ) {
            return null;
        }

        PermissionDto permissionDto = new PermissionDto();

        permissionDto.setId( permission.getId() );
        permissionDto.setName( permission.getName() );
        permissionDto.setDescription( permission.getDescription() );

        return permissionDto;
    }
}
