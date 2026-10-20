package com.example.securityScanner.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@Profile("prod")
public class ProductionSecurityConfig {

    @Bean
    public SecurityFilterChain productionSecurityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(auth -> auth.anyRequest().authenticated())
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()));
        return http.build();
    }

    @Bean
    public JwtDecoder jwtDecoder(@Value("${spring.security.oauth2.resourceserver.jwt.issuer-uri}") String issuerUri,
                                 @Value("${spring.security.oauth2.resourceserver.jwt.client-id}") String clientId,
                                 @Value("${app.security.allowed-user-sub}") String allowedUserSub) {

        NimbusJwtDecoder decoder = NimbusJwtDecoder.withIssuerLocation(issuerUri).build();
        OAuth2TokenValidator<Jwt> issuerValidator = JwtValidators.createDefaultWithIssuer(issuerUri);
        OAuth2TokenValidator<Jwt> tokenUseValidator = new JwtClaimValidator<>("token_use", "access"::equals);
        OAuth2TokenValidator<Jwt> clientIdValidator = new JwtClaimValidator<>("client_id", clientId::equals);
        OAuth2TokenValidator<Jwt> subjectValidator = new JwtClaimValidator<>("sub", allowedUserSub::equals);
        decoder.setJwtValidator(new DelegatingOAuth2TokenValidator<>(issuerValidator, tokenUseValidator, clientIdValidator, subjectValidator));
        return decoder;
    }
}
