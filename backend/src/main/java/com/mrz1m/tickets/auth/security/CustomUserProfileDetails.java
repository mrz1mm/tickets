package com.mrz1m.tickets.auth.security;

import com.mrz1m.tickets.auth.entity.UserProfile;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.Map;
import java.util.stream.Collectors;

@Getter
public class CustomUserProfileDetails implements OAuth2User, UserDetails {

    private final UserProfile userProfile;
    private final String password;
    @Setter
    private Map<String, Object> attributes;

    private CustomUserProfileDetails(UserProfile userProfile, String password, Map<String, Object> attributes) {
        this.userProfile = userProfile;
        this.password = password;
        this.attributes = attributes;
    }

    // Factory method per creare un'istanza per il login locale
    public static CustomUserProfileDetails createForLocalAuth(UserProfile userProfile, String password) {
        return new CustomUserProfileDetails(userProfile, password, null);
    }

    // Factory method per creare un'istanza con attributi OAuth2 (senza password)
    public static CustomUserProfileDetails createForOAuth2(UserProfile userProfile, Map<String, Object> attributes) {
        return new CustomUserProfileDetails(userProfile, null, attributes);
    }

    public Long getId() {
        return this.userProfile.getId();
    }


    // === Metodi da UserDetails ===

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

    // === Metodi da OAuth2User ===

    @Override
    public String getName() {
        // Il contratto OAuth2User richiede un "name".
        // Restituiamo il display name del profilo.
        return userProfile.getDisplayName();
    }
}