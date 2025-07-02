package com.mrz1m.tickets.auth.security;

import com.mrz1m.tickets.auth.entities.UserProfile;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.stream.Collectors;

@Getter
public class CustomUserProfileDetails implements UserDetails {

    private final UserProfile userProfile;
    private final String password;

    // Costruttore privato, si usa il factory method
    private CustomUserProfileDetails(UserProfile userProfile, String password) {
        this.userProfile = userProfile;
        this.password = password;
    }

    // Factory method per creare un'istanza per il login locale
    public static CustomUserProfileDetails createForLocalAuth(UserProfile userProfile, String password) {
        return new CustomUserProfileDetails(userProfile, password);
    }

    public Long getId() {
        return this.userProfile.getId();
    }

    public Long getCompanyId() {
        return this.userProfile.getCompany().getId();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.userProfile.getRoles().stream()
                .flatMap(role -> role.getPermissions().stream())
                .map(permission -> new SimpleGrantedAuthority(permission.getName()))
                .collect(Collectors.toList());
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public String getUsername() {
        return userProfile.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return userProfile.isEnabled();
    }
}