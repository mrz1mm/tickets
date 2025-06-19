package com.mrz1m.tickets.auth.mapper;

import com.mrz1m.tickets.auth.dto.PermissionDto;
import com.mrz1m.tickets.auth.entity.Permission;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PermissionMapper {

    PermissionDto toPermissionDto(Permission permission);
}