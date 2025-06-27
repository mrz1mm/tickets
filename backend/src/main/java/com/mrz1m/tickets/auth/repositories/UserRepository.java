package com.mrz1m.tickets.auth.repositories;

import com.mrz1m.tickets.auth.entities.UserProfile;
import com.mrz1m.tickets.auth.enums.AuthProvider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<UserProfile, Long> {

    Optional<UserProfile> findByEmail(String email);

    Optional<UserProfile> findByCredentials_ProviderAndCredentials_ProviderId(AuthProvider provider, String providerId);

    @Query("SELECT up FROM UserProfile up JOIN up.roles r JOIN r.permissions p WHERE p.name = :permissionName")
    List<UserProfile> findAllByPermissionName(@Param("permissionName") String permissionName);

}