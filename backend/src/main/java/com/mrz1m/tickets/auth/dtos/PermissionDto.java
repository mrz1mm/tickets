package com.mrz1m.tickets.auth.dtos;

import lombok.Data;

@Data
public class PermissionDto {
    private Long id;
    private String name;
    private String description;
}