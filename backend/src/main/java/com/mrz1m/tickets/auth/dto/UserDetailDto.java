package com.mrz1m.tickets.auth.dto;

import lombok.Data;
import java.time.OffsetDateTime;
import java.util.Map;
import java.util.Set;

@Data
public class UserDetailDto {
    private Long id;
    private String email;
    private String displayName;
    private boolean enabled;
    private OffsetDateTime createdAt;
    private Set<RoleDto> roles;
    private Map<String, Object> preferences;
}