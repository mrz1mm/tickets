package com.mrz1m.tickets.auth.mappers;

import com.mrz1m.tickets.auth.dtos.PermissionDto;
import com.mrz1m.tickets.auth.entities.Permission;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PermissionMapper {

    PermissionDto toPermissionDto(Permission permission);
}