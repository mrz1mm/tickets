package com.mrz1m.tickets.auth.service;

import com.mrz1m.tickets.auth.entity.UserCredential;
import com.mrz1m.tickets.auth.entity.UserProfile;
import com.mrz1m.tickets.auth.enums.AuthProvider;
import com.mrz1m.tickets.auth.repository.UserRepository;
import com.mrz1m.tickets.auth.security.CustomUserProfileDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        // Passo 1: Carica il profilo utente con le sue credenziali e ruoli (grazie a EAGER fetch)
        UserProfile userProfile = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Utente non trovato con email: " + email));

        // --- NUOVA LOGICA ---
        // Passo 2: Trova la credenziale LOCAL (con la password) tra quelle associate al profilo.
        // Questo sfrutta l'entity graph già caricato, è efficiente e corretto.
        String hashedPassword = userProfile.getCredentials().stream()
                .filter(credential -> credential.getProvider() == AuthProvider.LOCAL)
                .findFirst()
                .map(UserCredential::getPassword) // Estrae la password hashata
                .orElse(null); // Se l'utente si è registrato solo con Google, non avrà una password LOCAL.

        // Se l'utente esiste ma non ha una password (es. login solo via OAuth2),
        // l'autenticazione con password deve fallire. `hashedPassword` sarà null,
        // e DaoAuthenticationProvider gestirà correttamente il fallimento.

        // Passo 3: Crea l'oggetto UserDetails con la password corretta (hashata)
        return CustomUserProfileDetails.createForLocalAuth(userProfile, hashedPassword);
    }
}