package com.sge.backend.security;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class JwtUtilsTest {

    private static final String LLAVE_A = "llave-de-prueba-A-con-mas-de-32-bytes-de-largo";
    private static final String LLAVE_B = "llave-de-prueba-B-con-mas-de-32-bytes-de-largo";

    @Test
    void generaYLeeUnTokenConLaMismaLlave() {
        JwtUtils jwt = new JwtUtils(LLAVE_A);
        String token = jwt.generarToken("ana@correo.com", "ADMIN");

        assertTrue(jwt.validarToken(token, "ana@correo.com"));
        assertEquals("ADMIN", jwt.getRolDesdeToken(token));
    }

    @Test
    void rechazaUnTokenFirmadoConOtraLlave() {
        String tokenFalso = new JwtUtils(LLAVE_B).generarToken("ana@correo.com", "ADMIN");

        assertFalse(new JwtUtils(LLAVE_A).validarToken(tokenFalso, "ana@correo.com"));
    }

    @Test
    void noArrancaConUnaLlaveCorta() {
        assertThrows(IllegalStateException.class, () -> new JwtUtils("corta"));
    }
}
