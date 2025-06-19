package com.mrz1m.tickets.auth.mapper;

import com.mrz1m.tickets.auth.dto.RoleDto;
import com.mrz1m.tickets.auth.entity.Role;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface RoleMapper {

    RoleDto toRoleDto(Role role);
}