package com.mrz1m.tickets.core.services;

import com.mrz1m.tickets.core.dtos.CreateCompanyDto;
import com.mrz1m.tickets.core.entities.Company;

public interface CompanyService {
    Company createCompany(CreateCompanyDto createCompanyDto);
}