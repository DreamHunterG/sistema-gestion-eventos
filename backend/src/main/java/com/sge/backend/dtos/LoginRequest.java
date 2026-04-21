package com.sge.backend.dtos;

import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para capturar los datos del formulario de Login.
 */
@Data // Genera automáticamente los Getters y Setters
@NoArgsConstructor  // (seguridad)
public class LoginRequest {
    private String email;
    private String password;
}
