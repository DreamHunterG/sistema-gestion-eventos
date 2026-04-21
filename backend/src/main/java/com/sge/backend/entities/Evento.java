package com.sge.backend.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import jakarta.persistence.*;

/**
 * Entidad que representa los Eventos (Capacitaciones, Talleres o Torneos).
 * Vinculada a HU-05 (Creación) y RF-02 (Gestión Multimodal).
 */
@Entity
@Table(name = "eventos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Evento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String nombre;

    @Column(name = "fecha_evento", nullable = false)
    private LocalDateTime fechaEvento;

    @Column(name = "aforo_maximo", nullable = false)
    private Integer aforoMaximo;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_evento", nullable = false, length = 50)
    private TipoEvento tipoEvento;

    @Enumerated(EnumType.STRING) // Guarda el texto (ACTIVO/INACTIVO) en la DB
    @Column(length = 20)
    private EstadoEvento estado = EstadoEvento.ACTIVO; // Valor por defecto

    /**
     * Definición de los estados permitidos (Enum)
     */
    public enum EstadoEvento {
        ACTIVO,
        INACTIVO
    }

    @Column(name = "creado_at", updatable = false)
    private LocalDateTime creadoAt;

    // RELACIÓN: Muchos eventos son creados por un Usuario (Admin)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_creador")
    private Usuario creador;

    // Método automático para poner la fecha de creación antes de guardar .now -> indica hora actual
    @PrePersist
    protected void onCreate() {
        this.creadoAt = LocalDateTime.now();
    }

    /**
     * Categorías de eventos admitidas por el sistema.
     */
    public enum TipoEvento {
        CAPACITACION,
        TALLER,
        TORNEO
    }
}