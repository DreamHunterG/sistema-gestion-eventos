package com.sge.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Data;

/**
 * DTO para enviar la respuesta de autenticación exitosa.
 */
@Data
@AllArgsConstructor // Crea un constructor con todos los campos
@NoArgsConstructor  // (Añade esta también por seguridad)
public class AuthResponse {
    private String token;
    private String email;
    private String rol;
}