package com.sge.backend.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "inscripciones")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Inscripcion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_persona")
    private Persona persona;

    @ManyToOne
    @JoinColumn(name = "id_evento")
    private Evento evento;

    private Boolean asistio = false;

    @Column(name = "certificado_hash", unique = true)
    private String certificadoHash;

    @Column(name = "fecha_registro")
    private LocalDateTime fechaRegistro = LocalDateTime.now();

    @Column(name = "fecha_asistencia")
    private java.time.LocalDateTime fechaAsistencia;
}