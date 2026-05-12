package com.sge.backend.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "eventos")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Evento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String nombre;

    @Column(name = "fecha_evento", nullable = false)
    private LocalDateTime fechaEvento;

    @Column(name = "fecha_fin", nullable = false)
    private LocalDateTime fechaFin;

    @Column(name = "aforo_maximo", nullable = false)
    private Integer aforoMaximo;

    private Integer duracion;

    @Enumerated(EnumType.STRING)
    private TipoEvento tipoEvento = TipoEvento.CAPACITACION;

    @Enumerated(EnumType.STRING)
    private Modalidad modalidad = Modalidad.PRESENCIAL;

    @Enumerated(EnumType.STRING)
    private EstadoEvento estado = EstadoEvento.ACTIVO;

    @Column(name = "creado_at", updatable = false)
    private LocalDateTime creadoAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_creador")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Usuario creador;

    // 🔑 CAMBIO VITAL: Este campo permite que el Dashboard muestre el progreso de aforo
    @Transient
    private Integer totalAsistentes;

    @PrePersist
    protected void onCreate() {
        this.creadoAt = LocalDateTime.now();
    }

    public enum EstadoEvento { ACTIVO, INACTIVO }
    public enum TipoEvento { CAPACITACION, TALLER, TORNEO }
    public enum Modalidad { PRESENCIAL, VIRTUAL }
}