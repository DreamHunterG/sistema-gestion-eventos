package com.sge.backend.services;

import org.springframework.stereotype.Service;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;

/**
 * Motor de Criptografía del SGE.
 * Cumple con HU-17: Generación de firma digital única.
 */
@Service
public class CryptoService {

    // Esta es la "Sal" (Salt): un ingrediente secreto para que el hash sea imposible de adivinar
    private static final String SALT = "SGE_SECRET_2026_SENA";

    public String generarFirmaDigital(String email, Long eventoId) {
        try {
            // Combinar los datos para crear una cadena única
            String cadenaBase = email + "|" + eventoId + "|" + SALT;

            // UsaR el algoritmo SHA-256
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(cadenaBase.getBytes(StandardCharsets.UTF_8));

            // Lo convertimos a un formato de texto (Base64 o Hex) para guardarlo en la DB
            // Usar Hexadecimal para que tenga exactamente 64 caracteres -> si fuera necesario
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();

        } catch (Exception e) {
            throw new RuntimeException("Error al generar la firma digital", e);
        }
    }
}