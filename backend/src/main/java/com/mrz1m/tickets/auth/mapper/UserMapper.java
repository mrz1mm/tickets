package com.mrz1m.tickets.auth.mapper;

import org.mapstruct.Mapper;
import com.mrz1m.tickets.auth.dto.UserDto;
import com.mrz1m.tickets.auth.dto.UserDetailDto;
import com.mrz1m.tickets.auth.entity.UserProfile;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserDto toUserDto(UserProfile userProfile);
    UserDetailDto toUserDetailDto(UserProfile userProfile);
}
