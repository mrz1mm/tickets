package com.mrz1m.tickets.auth.repository;

import com.mrz1m.tickets.auth.entity.UserProfile;
import com.mrz1m.tickets.auth.enums.AuthProvider;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<UserProfile, Long> {

    Optional<UserProfile> findByEmail(String email);

    Optional<UserProfile> findByCredentials_ProviderAndCredentials_ProviderId(AuthProvider provider, String providerId);

}