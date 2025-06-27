package com.mrz1m.tickets.ticketing.mappers;

import com.mrz1m.tickets.ticketing.dtos.CreateDepartmentDto;
import com.mrz1m.tickets.ticketing.dtos.DepartmentDto;
import com.mrz1m.tickets.ticketing.dtos.UpdateDepartmentDto;
import com.mrz1m.tickets.ticketing.entities.Department;
import javax.annotation.processing.Generated;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-06-27T17:01:55+0200",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 24.0.1 (Oracle Corporation)"
)
public class DepartmentMapperImpl implements DepartmentMapper {

    @Override
    public DepartmentDto toDto(Department department) {
        if ( department == null ) {
            return null;
        }

        DepartmentDto departmentDto = new DepartmentDto();

        departmentDto.setId( department.getId() );
        departmentDto.setName( department.getName() );
        departmentDto.setDescription( department.getDescription() );

        return departmentDto;
    }

    @Override
    public Department toEntity(CreateDepartmentDto dto) {
        if ( dto == null ) {
            return null;
        }

        Department.DepartmentBuilder department = Department.builder();

        department.name( dto.name() );
        department.description( dto.description() );

        return department.build();
    }

    @Override
    public void updateFromDto(UpdateDepartmentDto dto, Department entity) {
        if ( dto == null ) {
            return;
        }

        entity.setName( dto.name() );
        entity.setDescription( dto.description() );
    }
}
