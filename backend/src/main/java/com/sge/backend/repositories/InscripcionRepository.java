package com.sge.backend.repositories;

import com.sge.backend.entities.Inscripcion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface InscripcionRepository extends JpaRepository<Inscripcion, Long> {
    List<Inscripcion> findByPersonaEmail(String email);
    Optional<Inscripcion> findByCertificadoHash(String hash);
    Optional<Inscripcion> findByIdAndEventoId(Long id, Long eventoId);


    // 🔑 NUEVO: Validador de duplicados normalizado
    boolean existsByPersonaIdAndEventoId(Long personaId, Long eventoId);
}