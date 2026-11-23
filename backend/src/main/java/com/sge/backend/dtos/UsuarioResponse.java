package com.sge.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UsuarioResponse {
    private Long id;
    private String nombre;
    private String email;
    private String rol;    // Aquí viajará el nombre del rol (ADMIN, MONITOR, etc.)
    private String estado; // ACTIVO o INACTIVO
}