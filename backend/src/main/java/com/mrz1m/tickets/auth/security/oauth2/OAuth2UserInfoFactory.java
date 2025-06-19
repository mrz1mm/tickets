package com.mrz1m.tickets.auth.security.oauth2;

import com.mrz1m.tickets.auth.enums.AuthProvider;
import com.mrz1m.tickets.auth.exception.OAuth2AuthenticationProcessingException;
import java.util.Map;

public class OAuth2UserInfoFactory {

    public static OAuth2UserInfo getOAuth2UserInfo(String registrationId, Map<String, Object> attributes) {

        AuthProvider provider;
        try {
            // Converte la stringa "google", "github", ecc. nel rispettivo valore dell'enum
            provider = AuthProvider.valueOf(registrationId.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new OAuth2AuthenticationProcessingException("Login con '" + registrationId + "' non è un provider riconosciuto.");
        }

        switch (provider) {
            case GOOGLE:
                // Questo provider è già implementato
                return new GoogleOAuth2UserInfo(attributes);

            /*
             * case GITHUB:
             *     // Per abilitare il login con GitHub, è necessario prima creare la classe
             *     // 'GithubOAuth2UserInfo' che implementi la logica per estrarre i dati
             *     // utente specifici di GitHub, e poi de-commentare questo blocco.
             *     return new GithubOAuth2UserInfo(attributes);
             */

            /*
             * case DISCORD:
             *     // Per abilitare il login con Discord, creare la classe 'DiscordOAuth2UserInfo'
             *     // e de-commentare questo blocco.
             *     return new DiscordOAuth2UserInfo(attributes);
             */

            /*
             * case FACEBOOK:
             *     // Per abilitare il login con Facebook, creare la classe 'FacebookOAuth2UserInfo'
             *     // e de-commentare questo blocco.
             *     return new FacebookOAuth2UserInfo(attributes);
             */

            /*
             * case TWITTER:
             *     // Per abilitare il login con Twitter, creare la classe 'TwitterOAuth2UserInfo'
             *     // e de-commentare questo blocco.
             *     return new TwitterOAuth2UserInfo(attributes);
             */

            // Il caso 'default' gestisce tutti gli altri provider dell'enum (come LOCAL)
            // o quelli per cui l'implementazione non è ancora stata de-commentata,
            // lanciando un'eccezione per notificare che non sono supportati.
            default:
                throw new OAuth2AuthenticationProcessingException("Login con " + registrationId + " non è ancora supportato.");
        }
    }
}