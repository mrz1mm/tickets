package com.mrz1m.tickets.ticketing.mappers;

import com.mrz1m.tickets.ticketing.dtos.CreateDepartmentDto;
import com.mrz1m.tickets.ticketing.dtos.DepartmentDto;
import com.mrz1m.tickets.ticketing.dtos.UpdateDepartmentDto;
import com.mrz1m.tickets.ticketing.entities.Department;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

@Mapper
public interface DepartmentMapper {
    DepartmentMapper INSTANCE = Mappers.getMapper(DepartmentMapper.class);

    // Da Entità a DTO (Questo non cambia)
    DepartmentDto toDto(Department department);

    // Da DTO di creazione a Entità
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    Department toEntity(CreateDepartmentDto dto);

    // Per aggiornare un'entità esistente da un DTO
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    void updateFromDto(UpdateDepartmentDto dto, @MappingTarget Department entity);
}