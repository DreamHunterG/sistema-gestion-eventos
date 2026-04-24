package com.sge.backend.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "eventos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
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

    @Enumerated(EnumType.STRING) // 🔑 INDISPENSABLE
    @Column(name = "tipo_evento", nullable = false, length = 50)
    private TipoEvento tipoEvento = TipoEvento.CAPACITACION;

    @Enumerated(EnumType.STRING) // 🔑 INDISPENSABLE
    @Column(nullable = false, length = 20)
    private Modalidad modalidad = Modalidad.PRESENCIAL;

    @Enumerated(EnumType.STRING) // 🔑 INDISPENSABLE
    @Column(length = 20)
    private EstadoEvento estado = EstadoEvento.ACTIVO;

    @Column(name = "creado_at", updatable = false)
    private LocalDateTime creadoAt;

    @Transient // Para el conteo dinámico que pide Angular
    private Integer totalAsistentes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_creador")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Usuario creador;

    @PrePersist
    protected void onCreate() {
        this.creadoAt = LocalDateTime.now();
    }

    public enum EstadoEvento { ACTIVO, INACTIVO }
    public enum TipoEvento { CAPACITACION, TALLER, TORNEO }
    public enum Modalidad { PRESENCIAL, VIRTUAL }
}