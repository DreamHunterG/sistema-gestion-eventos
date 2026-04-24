package com.sge.backend.repositories;

import com.sge.backend.entities.Evento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;
import java.util.List;

@Repository
public interface EventoRepository extends JpaRepository<Evento, Long> {

    // Busca eventos por el Enum del estado
    List<Evento> findByEstado(Evento.EstadoEvento estado);

    // HU-23: Query para contar cuántos participantes marcaron asistencia en este evento
    // NUEVO: Cuenta cuántos participantes han marcado "asistio = true" para un evento
    @Query("SELECT COUNT(p) FROM Participante p WHERE p.evento.id = :eventoId AND p.asistio = true")
    Integer countAsistentesReal(@Param("eventoId") Long eventoId);
}