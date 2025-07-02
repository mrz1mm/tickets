package com.mrz1m.tickets.core.repositories;

import com.mrz1m.tickets.core.entities.Company;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyRepository extends JpaRepository<Company, Long> {
}
