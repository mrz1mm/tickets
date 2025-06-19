package com.mrz1m.tickets.ticketing.mapper;

import com.mrz1m.tickets.ticketing.dto.DepartmentDto;
import com.mrz1m.tickets.ticketing.entity.Department;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface DepartmentMapper {

    DepartmentDto toDepartmentDto(Department department);
}
