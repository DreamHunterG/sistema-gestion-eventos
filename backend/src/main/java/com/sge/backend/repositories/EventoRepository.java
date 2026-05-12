package com.sge.backend.repositories;

import com.sge.backend.entities.Evento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface EventoRepository extends JpaRepository<Evento, Long> {

    List<Evento> findByEstado(Evento.EstadoEvento estado);

    // 🔑 CORREGIDO: Cambiamos 'Participante' por 'Inscripcion'
    @Query("SELECT COUNT(i) FROM Inscripcion i WHERE i.evento.id = :eventoId AND i.asistio = true")
    Integer countAsistentesReal(@Param("eventoId") Long eventoId);
}