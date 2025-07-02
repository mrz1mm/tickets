package com.mrz1m.tickets.core.services;

import com.mrz1m.tickets.core.dtos.CreateCompanyDto;
import com.mrz1m.tickets.core.entities.Company;
import com.mrz1m.tickets.core.repositories.CompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CompanyServiceImpl implements CompanyService {

    private final CompanyRepository companyRepository;

    @Override
    @Transactional
    public Company createCompany(CreateCompanyDto createCompanyDto) {
        Company company = Company.builder()
                .name(createCompanyDto.getName())
                .build();
        return companyRepository.save(company);
    }
}