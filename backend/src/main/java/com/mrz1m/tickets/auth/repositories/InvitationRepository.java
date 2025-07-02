package com.mrz1m.tickets.auth.repositories;

import com.mrz1m.tickets.auth.entities.Invitation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InvitationRepository extends JpaRepository<Invitation, Long> {
    Optional<Invitation> findByTokenAndIsRegisteredFalse(String token);
    boolean existsByEmailAndCompanyIdAndIsRegisteredFalse(String email, Long companyId);
}