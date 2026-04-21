package com.sge.backend.repositories;

import com.sge.backend.entities.Participante;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ParticipanteRepository extends JpaRepository<Participante, Long> {
    // Poder extra: Verificar si un email ya existe en un evento (HU-24)
    boolean existsByEmailAndEventoId(String email, Long eventoId);

    // Poder extra: Buscar por el Hash para la validación pública (HU-19) de certificados de esta manera se puede validar el certificado sin necesidad de autenticación
    Optional<Participante> findByCertificadoHash(String hash);
}