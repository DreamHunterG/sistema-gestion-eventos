package com.sge.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.function.Function;

@Component
public class JwtUtils {
    private static final String SECRET_STRING = "EstaEsUnaLlaveSuperSecretaParaSGE2026SenaPro";
    private static final Key SECRET_KEY = Keys.hmacShaKeyFor(SECRET_STRING.getBytes(StandardCharsets.UTF_8));
    private static final long EXPIRATION_TIME = 86_400_000;

    public String generarToken(String email, String rol) {
        return Jwts.builder()
                .setSubject(email)
                .claim("rol", rol) // 🔑 Guardamos el rol aquí
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
                .compact();
    }

    public String getEmailDesdeToken(String token) { return getClaim(token, Claims::getSubject); }

    public String getRolDesdeToken(String token) {
        return getClaim(token, claims -> claims.get("rol", String.class));
    }

    public boolean validarToken(String token, String emailEsperado) {
        try {
            final String email = getEmailDesdeToken(token);
            return (email.equals(emailEsperado) && !isTokenExpirado(token));
        } catch (Exception e) { return false; }
    }

    private boolean isTokenExpirado(String token) { return getClaim(token, Claims::getExpiration).before(new Date()); }

    private <T> T getClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = Jwts.parserBuilder().setSigningKey(SECRET_KEY).build().parseClaimsJws(token).getBody();
        return claimsResolver.apply(claims);
    }
}