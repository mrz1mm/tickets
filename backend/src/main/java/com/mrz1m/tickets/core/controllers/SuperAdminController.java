package com.mrz1m.tickets.core.controllers;

import com.mrz1m.tickets.core.dtos.CreateCompanyDto;
import com.mrz1m.tickets.core.entities.Company;
import com.mrz1m.tickets.core.payloads.ApiResponse;
import com.mrz1m.tickets.core.services.CompanyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/super-admin")
@PreAuthorize("hasRole('ROLE_SUPER_ADMIN')")
@RequiredArgsConstructor
public class SuperAdminController {

    private final CompanyService companyService;

    @GetMapping("/companies")
    public ResponseEntity<ApiResponse<List<Company>>> getAllCompanies() {
        List<Company> companies = companyService.findAll();
        return ResponseEntity.ok(ApiResponse.ok("Aziende recuperate con successo.", companies));
    }

    @PostMapping("/companies")
    public ResponseEntity<ApiResponse<Company>> createCompany(@Valid @RequestBody CreateCompanyDto createCompanyDto) {
        Company newCompany = companyService.createCompany(createCompanyDto);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.created("Azienda creata con successo.", newCompany));
    }

    @PutMapping("/companies/{id}")
    public ResponseEntity<ApiResponse<Company>> updateCompany(@PathVariable Long id, @Valid @RequestBody CreateCompanyDto updateDto) {
        Company updatedCompany = companyService.updateCompany(id, updateDto);
        return ResponseEntity.ok(ApiResponse.ok("Azienda aggiornata con successo.", updatedCompany));
    }

    @DeleteMapping("/companies/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCompany(@PathVariable Long id) {
        companyService.deleteCompany(id);
        return ResponseEntity.noContent().build();
    }
}