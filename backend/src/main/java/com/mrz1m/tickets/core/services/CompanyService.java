package com.mrz1m.tickets.core.services;

import com.mrz1m.tickets.core.dtos.CreateCompanyDto;
import com.mrz1m.tickets.core.entities.Company;

import java.util.List;

public interface CompanyService {
    Company createCompany(CreateCompanyDto createCompanyDto);
    List<Company> findAll();
    Company updateCompany(Long id, CreateCompanyDto updateDto);
    void deleteCompany(Long id);
}