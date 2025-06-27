package com.mrz1m.tickets.auth.mapper;

import com.mrz1m.tickets.auth.dto.PermissionDto;
import com.mrz1m.tickets.auth.dto.RoleDto;
import com.mrz1m.tickets.auth.dto.UserDetailDto;
import com.mrz1m.tickets.auth.dto.UserDto;
import com.mrz1m.tickets.auth.entity.Permission;
import com.mrz1m.tickets.auth.entity.Role;
import com.mrz1m.tickets.auth.entity.UserProfile;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Set;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-06-27T16:18:01+0200",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.6 (OpenLogic)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public UserDto toUserDto(UserProfile userProfile) {
        if ( userProfile == null ) {
            return null;
        }

        UserDto userDto = new UserDto();

        userDto.setId( userProfile.getId() );
        userDto.setEmail( userProfile.getEmail() );
        userDto.setDisplayName( userProfile.getDisplayName() );

        return userDto;
    }

    @Override
    public UserDetailDto toUserDetailDto(UserProfile userProfile) {
        if ( userProfile == null ) {
            return null;
        }

        UserDetailDto userDetailDto = new UserDetailDto();

        userDetailDto.setId( userProfile.getId() );
        userDetailDto.setEmail( userProfile.getEmail() );
        userDetailDto.setDisplayName( userProfile.getDisplayName() );
        userDetailDto.setEnabled( userProfile.isEnabled() );
        userDetailDto.setCreatedAt( userProfile.getCreatedAt() );
        userDetailDto.setRoles( roleSetToRoleDtoSet( userProfile.getRoles() ) );
        Map<String, Object> map = userProfile.getPreferences();
        if ( map != null ) {
            userDetailDto.setPreferences( new LinkedHashMap<String, Object>( map ) );
        }

        return userDetailDto;
    }

    protected PermissionDto permissionToPermissionDto(Permission permission) {
        if ( permission == null ) {
            return null;
        }

        PermissionDto permissionDto = new PermissionDto();

        permissionDto.setId( permission.getId() );
        permissionDto.setName( permission.getName() );
        permissionDto.setDescription( permission.getDescription() );

        return permissionDto;
    }

    protected Set<PermissionDto> permissionSetToPermissionDtoSet(Set<Permission> set) {
        if ( set == null ) {
            return null;
        }

        Set<PermissionDto> set1 = new LinkedHashSet<PermissionDto>( Math.max( (int) ( set.size() / .75f ) + 1, 16 ) );
        for ( Permission permission : set ) {
            set1.add( permissionToPermissionDto( permission ) );
        }

        return set1;
    }

    protected RoleDto roleToRoleDto(Role role) {
        if ( role == null ) {
            return null;
        }

        RoleDto roleDto = new RoleDto();

        roleDto.setId( role.getId() );
        roleDto.setName( role.getName() );
        roleDto.setDescription( role.getDescription() );
        roleDto.setPermissions( permissionSetToPermissionDtoSet( role.getPermissions() ) );

        return roleDto;
    }

    protected Set<RoleDto> roleSetToRoleDtoSet(Set<Role> set) {
        if ( set == null ) {
            return null;
        }

        Set<RoleDto> set1 = new LinkedHashSet<RoleDto>( Math.max( (int) ( set.size() / .75f ) + 1, 16 ) );
        for ( Role role : set ) {
            set1.add( roleToRoleDto( role ) );
        }

        return set1;
    }
}
