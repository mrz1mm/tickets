package com.mrz1m.tickets.auth.mappers;

import com.mrz1m.tickets.auth.dtos.RoleDto;
import com.mrz1m.tickets.auth.entities.Role;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface RoleMapper {

    RoleDto toRoleDto(Role role);
}