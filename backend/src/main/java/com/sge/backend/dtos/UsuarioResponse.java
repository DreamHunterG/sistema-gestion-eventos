package com.sge.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO de Salida (Response).
 * Transporta los datos del equipo hacia el Front-end sin exponer la contraseña.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UsuarioResponse {
    private Long id;
    private String nombre;
    private String email;
    private String rol;
    private String estado;
}



