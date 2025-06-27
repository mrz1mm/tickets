package com.mrz1m.tickets.auth.mappers;

import org.mapstruct.Mapper;
import com.mrz1m.tickets.auth.dtos.UserDto;
import com.mrz1m.tickets.auth.dtos.UserDetailDto;
import com.mrz1m.tickets.auth.entities.UserProfile;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserDto toUserDto(UserProfile userProfile);
    UserDetailDto toUserDetailDto(UserProfile userProfile);
}
