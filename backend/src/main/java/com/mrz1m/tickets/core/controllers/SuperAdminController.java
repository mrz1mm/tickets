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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/super-admin")
@PreAuthorize("hasRole('ROLE_SUPER_ADMIN')")
@RequiredArgsConstructor
public class SuperAdminController {

    private final CompanyService companyService;

    @PostMapping("/companies")
    public ResponseEntity<ApiResponse<Company>> createCompany(@Valid @RequestBody CreateCompanyDto createCompanyDto) {
        Company newCompany = companyService.createCompany(createCompanyDto);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.created("Azienda creata con successo.", newCompany));
    }
}