package com.sge.backend.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "auditoria")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Auditoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String usuarioEmail; // Quién (Actor)
    private String accion;       // Qué (INSERT, UPDATE, DELETE)
    private String entidad;      // Dónde (EVENTO, USUARIO, INSCRIPCION)

    @Column(length = 500)
    private String detalle;      // Descripción del cambio

    private LocalDateTime fecha; // Cuándo

    // Constructor optimizado para el código
    public Auditoria(String usuarioEmail, String accion, String entidad, String detalle) {
        this.usuarioEmail = usuarioEmail;
        this.accion = accion;
        this.entidad = entidad;
        this.detalle = detalle;
        this.fecha = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (this.fecha == null) this.fecha = LocalDateTime.now();
    }
}