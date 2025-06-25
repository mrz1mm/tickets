package com.mrz1m.tickets.ticketing.controller;

import com.mrz1m.tickets.core.exception.ResourceInUseException;
import com.mrz1m.tickets.core.payload.ApiResponse;
import com.mrz1m.tickets.ticketing.dto.CreateDepartmentDto;
import com.mrz1m.tickets.ticketing.dto.DepartmentDto;
import com.mrz1m.tickets.ticketing.dto.UpdateDepartmentDto;
import com.mrz1m.tickets.ticketing.service.DepartmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/departments")
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentService departmentService;

    @PostMapping
    @PreAuthorize("hasAuthority('DEPARTMENT_WRITE')")
    public ResponseEntity<ApiResponse<DepartmentDto>> createDepartment(@Valid @RequestBody CreateDepartmentDto createDto) {
        DepartmentDto newDepartment = departmentService.createDepartment(createDto);
        // Usa il tuo metodo factory 'created' che imposta automaticamente lo status 201
        return ResponseEntity.status(201).body(
                ApiResponse.created("Dipartimento creato con successo.", newDepartment)
        );
    }

    @GetMapping
    @PreAuthorize("hasAuthority('DEPARTMENT_READ')")
    public ResponseEntity<ApiResponse<List<DepartmentDto>>> getAllDepartments() {
        List<DepartmentDto> departments = departmentService.findAll();
        // Usa il tuo metodo factory 'ok' che imposta automaticamente lo status 200
        return ResponseEntity.ok(
                ApiResponse.ok("Dipartimenti recuperati con successo.", departments)
        );
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('DEPARTMENT_READ')")
    public ResponseEntity<ApiResponse<DepartmentDto>> getDepartmentById(@PathVariable Long id) {
        return departmentService.findById(id)
                .map(department -> ResponseEntity.ok(ApiResponse.ok("Dipartimento trovato.", department)))
                .orElse(ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.notFound("Dipartimento non trovato con ID: " + id)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('DEPARTMENT_WRITE')")
    public ResponseEntity<ApiResponse<DepartmentDto>> updateDepartment(@PathVariable Long id, @Valid @RequestBody UpdateDepartmentDto updateDto) {
        return departmentService.updateDepartment(id, updateDto)
                .map(updatedDepartment -> ResponseEntity.ok(ApiResponse.ok("Dipartimento aggiornato con successo.", updatedDepartment)))
                .orElse(ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.notFound("Impossibile aggiornare. Dipartimento non trovato con ID: " + id)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('DEPARTMENT_WRITE')")
    public ResponseEntity<ApiResponse<Void>> deleteDepartment(@PathVariable Long id) {
        try {
            boolean deleted = departmentService.deleteDepartment(id);
            if (deleted) {
                return ResponseEntity.noContent().build();
            } else {
                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.notFound("Impossibile eliminare. Dipartimento non trovato."));
            }
        } catch (ResourceInUseException ex) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(ApiResponse.conflict(ex.getMessage()));
        }
    }
}