package com.mrz1m.tickets.auth.services;

import com.mrz1m.tickets.auth.entities.Role;
import com.mrz1m.tickets.auth.entities.UserCredential;
import com.mrz1m.tickets.auth.entities.UserProfile;
import com.mrz1m.tickets.auth.enums.AuthProvider;
import com.mrz1m.tickets.auth.repositories.RoleRepository;
import com.mrz1m.tickets.auth.repositories.UserRepository;
import com.mrz1m.tickets.auth.security.CustomUserProfileDetails;
import com.mrz1m.tickets.auth.security.oauth2.OAuth2UserInfo;
import com.mrz1m.tickets.auth.security.oauth2.OAuth2UserInfoFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    UserRepository userRepository;
    @Autowired
    RoleRepository roleRepository;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String providerId = userRequest.getClientRegistration().getRegistrationId();
        OAuth2UserInfo oAuth2UserInfo = OAuth2UserInfoFactory.getOAuth2UserInfo(providerId, oAuth2User.getAttributes());

        Optional<UserProfile> userOptional = userRepository.findByEmail(oAuth2UserInfo.getEmail());
        UserProfile userProfile;

        if (userOptional.isPresent()) {
            userProfile = userOptional.get();
            updateExistingUser(userProfile, oAuth2UserInfo, providerId);
        } else {
            userProfile = registerNewUser(oAuth2UserInfo, providerId);
        }

        return CustomUserProfileDetails.createForOAuth2(userProfile, oAuth2User.getAttributes());
    }

    private UserProfile registerNewUser(OAuth2UserInfo userInfo, String provider) {
        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new IllegalStateException("Ruolo ROLE_USER non trovato."));

        UserProfile newUserProfile = UserProfile.builder()
                .email(userInfo.getEmail())
                .displayName(userInfo.getName())
                .enabled(true)
                .roles(Set.of(userRole))
                .build();

        UserCredential credential = UserCredential.builder()
                .userProfile(newUserProfile)
                .provider(AuthProvider.valueOf(provider.toUpperCase()))
                .providerId(userInfo.getProviderId())
                .build();

        newUserProfile.getCredentials().add(credential);
        return userRepository.save(newUserProfile);
    }

    private void updateExistingUser(UserProfile existingUser, OAuth2UserInfo userInfo, String providerId) {
        existingUser.setDisplayName(userInfo.getName());

        boolean hasProviderCredential = existingUser.getCredentials().stream()
                .anyMatch(c -> c.getProvider().name().equalsIgnoreCase(providerId));

        if (!hasProviderCredential) {
            UserCredential credential = UserCredential.builder()
                    .userProfile(existingUser)
                    .provider(AuthProvider.valueOf(providerId.toUpperCase()))
                    .providerId(userInfo.getProviderId())
                    .build();
            existingUser.getCredentials().add(credential);
            userRepository.save(existingUser); // Salva solo se è stata aggiunta una nuova credenziale
        }
    }
}