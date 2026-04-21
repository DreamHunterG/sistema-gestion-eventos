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

    // 🔑 LLAVE MAESTRA FIJA: Garantiza que el servidor reconozca los tokens tras reiniciar
    private static final String SECRET_STRING = "EstaEsUnaLlaveSuperSecretaParaSGE2026SenaPro";
    private static final Key SECRET_KEY = Keys.hmacShaKeyFor(SECRET_STRING.getBytes(StandardCharsets.UTF_8));

    // El pase durará 24 horas (en milisegundos)
    private static final long EXPIRATION_TIME = 86_400_000;

    // 1. GENERAR TOKEN: Crea el pase VIP (HU-01)
    public String generarToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
                .compact();
    }

    // 2. EXTRAER USUARIO: ¿A quién le pertenece este pase?
    public String getEmailDesdeToken(String token) {
        return getClaim(token, Claims::getSubject);
    }

    // 3. VALIDAR TOKEN: ¿El pase es auténtico y está vigente?
    public boolean validarToken(String token, String emailEsperado) {
        try {
            final String emailRelativo = getEmailDesdeToken(token);
            return (emailRelativo.equals(emailEsperado) && !isTokenExpirado(token));
        } catch (Exception e) {
            return false;
        }
    }

    // --- FUNCIONES INTERNAS DE APOYO ---

    private boolean isTokenExpirado(String token) {
        return getClaim(token, Claims::getExpiration).before(new Date());
    }

    private <T> T getClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claimsResolver.apply(claims);
    }
}