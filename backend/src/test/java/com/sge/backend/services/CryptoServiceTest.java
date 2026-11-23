package com.sge.backend.services;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class CryptoServiceTest {

    private static final String LLAVE_A = "llave-de-prueba-A-con-mas-de-32-bytes-de-largo";
    private static final String LLAVE_B = "llave-de-prueba-B-con-mas-de-32-bytes-de-largo";

    @Test
    void laMismaEntradaDaLaMismaFirma() {
        CryptoService crypto = new CryptoService(LLAVE_A);

        assertEquals(crypto.generarFirmaDigital("ana@correo.com", 1L),
                     crypto.generarFirmaDigital("ana@correo.com", 1L));
    }

    @Test
    void laFirmaTiene64CaracteresHexadecimales() {
        String firma = new CryptoService(LLAVE_A).generarFirmaDigital("ana@correo.com", 1L);

        assertTrue(firma.matches("[0-9a-f]{64}"));
    }

    @Test
    void otraLlaveDaOtraFirma() {
        assertNotEquals(new CryptoService(LLAVE_A).generarFirmaDigital("ana@correo.com", 1L),
                        new CryptoService(LLAVE_B).generarFirmaDigital("ana@correo.com", 1L));
    }

    @Test
    void noArrancaConUnaLlaveCorta() {
        assertThrows(IllegalStateException.class, () -> new CryptoService("corta"));
    }
}
