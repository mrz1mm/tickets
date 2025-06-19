package com.mrz1m.tickets.core.config;

import com.mrz1m.tickets.auth.security.JwtAuthenticationFilter;
import com.mrz1m.tickets.auth.service.CustomOAuth2UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true) // Abilita la sicurezza a livello di metodo (es. @PreAuthorize)
@RequiredArgsConstructor
public class MainSecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final CustomOAuth2UserService customOAuth2UserService;

    /**
     * Bean che definisce il provider di autenticazione.
     * Utilizza un DaoAuthenticationProvider per recuperare i dettagli dell'utente
     * e confrontare le password.
     */
    @Bean
    public AuthenticationProvider authenticationProvider(UserDetailsService userDetailsService, PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider(passwordEncoder);
        authProvider.setUserDetailsService(userDetailsService);
        return authProvider;
    }

    /**
     * Bean che espone l'AuthenticationManager, necessario per il processo di login manuale.
     * Viene usato in AuthServiceImpl per autenticare l'utente.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, AuthenticationProvider authenticationProvider) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(
                                "/api/v1/auth/**",
                                "/oauth2/**",
                                "/login"
                        ).permitAll()
                        .requestMatchers(
                                "/v3/api-docs/**",
                                "/swagger-ui/**"
                        ).permitAll()
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider)
                .oauth2Login(oauth2 -> {
                    oauth2
                            .userInfoEndpoint(userInfo -> userInfo.userService(customOAuth2UserService))
                            .successHandler((request, response, authentication) -> {
                                // Questo successHandler andrebbe migliorato per impostare il cookie JWT
                                // e poi reindirizzare, per uniformare l'esperienza con il login locale.
                                // Per ora, lasciamo il redirect standard.
                                response.sendRedirect("http://localhost:4200/dashboard");
                            });
                })
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }


    /**
     * Bean per la configurazione del CORS (Cross-Origin Resource Sharing).
     * Definisce quali domini frontend possono fare richieste a questa API.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Specifica l'origine del frontend Angular
        configuration.setAllowedOrigins(List.of("http://localhost:4200"));

        // Specifica i metodi HTTP permessi
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));

        // Permetti tutti gli header (inclusi 'Authorization' per il JWT)
        configuration.setAllowedHeaders(List.of("*"));

        // Permetti al browser di inviare credenziali (es. cookie, token di autorizzazione)
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Applica questa configurazione a tutti gli endpoint dell'applicazione
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    /**
     * Bean per la codifica delle password.
     * Utilizza BCrypt, l'algoritmo di hashing standard e raccomandato per la sicurezza.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}