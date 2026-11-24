package com.sge.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.function.Function;

@Component
public class JwtUtils {
    // HS256 exige una llave de al menos 256 bits (32 bytes)
    private static final int MIN_BYTES_LLAVE = 32;
    private static final long EXPIRATION_TIME = 86_400_000;

    // 🔐 La llave ya no vive en el código: llega desde la configuración (sge.jwt.secret)
    private final Key llave;

    public JwtUtils(@Value("${sge.jwt.secret}") String secreto) {
        byte[] bytes = secreto.getBytes(StandardCharsets.UTF_8);
        if (bytes.length < MIN_BYTES_LLAVE) {
            throw new IllegalStateException("sge.jwt.secret debe tener al menos " + MIN_BYTES_LLAVE + " bytes");
        }
        this.llave = Keys.hmacShaKeyFor(bytes);
    }

    public String generarToken(String email, String rol) {
        return Jwts.builder()
                .setSubject(email)
                .claim("rol", rol) // 🔑 Guardamos el rol aquí
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(llave, SignatureAlgorithm.HS256)
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
        final Claims claims = Jwts.parserBuilder().setSigningKey(llave).build().parseClaimsJws(token).getBody();
        return claimsResolver.apply(claims);
    }
}