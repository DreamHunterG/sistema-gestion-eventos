package com.sge.backend.repositories;

import com.sge.backend.entities.Evento;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;


public interface EventoRepository extends JpaRepository<Evento, Long> {
    // Poder extra: Buscar solo eventos que no estén archivados (HU-08)
    List<Evento> findByEstado(String estado);

    // Esto sirve para contar cuántos participantes asistieron a un evento específico ->útil para mostrar estadísticas o
    // validar el número de asistentes (podría ser parte de HU-05 o una funcionalidad adicional)
    @org.springframework.data.jpa.repository.Query("SELECT COUNT(p) FROM Participante p WHERE p.evento.id = :id AND p.asistio = true")
    int countAsistentesPorEvento(Long id);


}

