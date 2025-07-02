package com.mrz1m.tickets.core.services;

import com.mrz1m.tickets.core.dtos.CreateCompanyDto;
import com.mrz1m.tickets.core.entities.Company;
import com.mrz1m.tickets.core.repositories.CompanyRepository;
import com.mrz1m.tickets.ticketing.exceptions.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

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

    @Override
    @Transactional(readOnly = true)
    public List<Company> findAll() {
        return companyRepository.findAll();
    }

    @Override
    @Transactional
    public Company updateCompany(Long id, CreateCompanyDto updateDto) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company", "id", id));
        company.setName(updateDto.getName());
        return companyRepository.save(company);
    }

    @Override
    @Transactional
    public void deleteCompany(Long id) {
        if (!companyRepository.existsById(id)) {
            throw new ResourceNotFoundException("Company", "id", id);
        }
        companyRepository.deleteById(id);
    }
}