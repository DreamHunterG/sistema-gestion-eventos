package com.sge.backend.entities;

import jakarta.persistence.*;
import lombok.*;

/**
 * Entidad Usuario - Representa a los usuarios del sistema con roles específicos.
 * Roles finales: ADMIN (Gestión y Carga), MONITOR (Campo y QR), PARTICIPANTE (Descarga).
 */
@Entity
@Table(name = "usuarios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 100)
    private String email;

    @Column(nullable = false, length = 255)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Rol rol;

    /**
     * Definición de Roles más sencilla para el MVP -> cumplir el reto .
     * NOTA PARA EL FUTURO: Si lo lelgase a esclar, se podría implementar una tabla de roles y permisos más compleja, pero para el alcance actual, esta enum es suficiente.
     */
    public enum Rol {
        ADMIN,       // Puede crear eventos y subir listas CSV
        MONITOR,     // Solo puede escanear QRs en la puerta
        PARTICIPANTE // Solo puede ver y descargar su certificado
    }
}