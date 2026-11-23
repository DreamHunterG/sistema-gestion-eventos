package com.sge.backend.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.HexFormat;

/**
 * Motor de Criptografía del SGE.
 * Cumple con HU-17: Generación de firma digital única.
 *
 * Usa HMAC-SHA256: un hash que solo puede producir quien conoce la llave secreta.
 * Así nadie puede fabricar una firma válida aunque conozca el email y el evento.
 */
@Service
public class CryptoService {

    private static final String ALGORITMO = "HmacSHA256";
    private static final int MIN_BYTES_LLAVE = 32;

    // 🔐 La llave llega desde la configuración (sge.firma.secret), no desde el código
    private final SecretKeySpec llave;

    public CryptoService(@Value("${sge.firma.secret}") String secreto) {
        byte[] bytes = secreto.getBytes(StandardCharsets.UTF_8);
        if (bytes.length < MIN_BYTES_LLAVE) {
            throw new IllegalStateException("sge.firma.secret debe tener al menos " + MIN_BYTES_LLAVE + " bytes");
        }
        this.llave = new SecretKeySpec(bytes, ALGORITMO);
    }

    public String generarFirmaDigital(String email, Long eventoId) {
        try {
            // Combinar los datos para crear una cadena única
            String cadenaBase = email + "|" + eventoId;

            Mac mac = Mac.getInstance(ALGORITMO);
            mac.init(llave);
            byte[] firma = mac.doFinal(cadenaBase.getBytes(StandardCharsets.UTF_8));

            // Hexadecimal: exactamente 64 caracteres, igual que antes
            return HexFormat.of().formatHex(firma);

        } catch (Exception e) {
            throw new RuntimeException("Error al generar la firma digital", e);
        }
    }
}
