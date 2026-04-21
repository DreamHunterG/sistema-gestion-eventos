package com.sge.backend.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties; // <--- NUEVA IMPORTACIÓN
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * Entidad que representa a los inscritos en los eventos.
 * Corazón de la lógica de asistencia (HU-13) y certificación (HU-17).
 */
@Entity
@Table(name = "participantes", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"email", "id_evento"}) // Regla de Oro: Evita duplicados por evento
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Participante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre_completo", nullable = false, length = 150)
    private String nombreCompleto;

    @Column(nullable = false, length = 100)
    private String email;

    @Column(nullable = false)
    private Boolean asistio = false;

    @Column(name = "certificado_hash", unique = true, length = 64)
    private String certificadoHash;

    @Column(name = "fecha_registro", updatable = false)
    private LocalDateTime fechaRegistro;

    // RELACIÓN: Un participante pertenece a un solo Evento
    // @JsonIgnoreProperties evita errores cuando el sistema intenta mostrar el resultado en Postman
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_evento")
    private Evento evento;

    // RELACIÓN DE AUDITORÍA: Quién registró a este participante
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "registrado_por")
    private Usuario registradoPor;

    @PrePersist
    protected void onRegister() {
        this.fechaRegistro = LocalDateTime.now();
    }
}