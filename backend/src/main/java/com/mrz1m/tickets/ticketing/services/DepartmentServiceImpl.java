package com.mrz1m.tickets.ticketing.services;

import com.mrz1m.tickets.core.exceptions.ResourceInUseException;
import com.mrz1m.tickets.ticketing.dtos.CreateDepartmentDto;
import com.mrz1m.tickets.ticketing.dtos.DepartmentDto;
import com.mrz1m.tickets.ticketing.dtos.UpdateDepartmentDto;
import com.mrz1m.tickets.ticketing.entities.Department;
import com.mrz1m.tickets.ticketing.mappers.DepartmentMapper;
import com.mrz1m.tickets.ticketing.repositories.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final DepartmentMapper departmentMapper = DepartmentMapper.INSTANCE;

    @Override
    @Transactional
    public DepartmentDto createDepartment(CreateDepartmentDto createDepartmentDto) {
        Department department = departmentMapper.toEntity(createDepartmentDto);
        Department savedDepartment = departmentRepository.save(department);
        return departmentMapper.toDto(savedDepartment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DepartmentDto> findAll() {
        return departmentRepository.findAll().stream()
                .map(departmentMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<DepartmentDto> findById(Long id) {
        return departmentRepository.findById(id)
                .map(departmentMapper::toDto);
    }

    @Override
    @Transactional
    public Optional<DepartmentDto> updateDepartment(Long id, UpdateDepartmentDto updateDepartmentDto) {
        return departmentRepository.findById(id).map(existingDepartment -> {
            departmentMapper.updateFromDto(updateDepartmentDto, existingDepartment);
            Department updatedDepartment = departmentRepository.save(existingDepartment);
            return departmentMapper.toDto(updatedDepartment);
        });
    }

    @Override
    @Transactional
    public boolean deleteDepartment(Long id) {
        if (!departmentRepository.existsById(id)) {
            return false;
        }

        if (departmentRepository.hasAssociatedTickets(id)) {
            throw new ResourceInUseException("Impossibile eliminare il dipartimento perché ha dei ticket associati.");
        }

        departmentRepository.deleteById(id);
        return true;
    }
}