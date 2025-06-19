package com.mrz1m.tickets.ticketing.repository;

import com.mrz1m.tickets.ticketing.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartmentRepository extends JpaRepository<Department, Long> {}