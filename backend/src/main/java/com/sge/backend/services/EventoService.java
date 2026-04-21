package com.sge.backend.services;

import com.sge.backend.entities.Evento;
import com.sge.backend.repositories.EventoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

/**
 * Lógica de negocio para la gestión de Eventos y Torneos.
 * Cumple con RF-02 y HU-05, 07, 08.
 */
@Service // Le dice a Spring: "Este archivo es el cerebro de los eventos"
public class EventoService {

    @Autowired // Conecta el servicio con las "manos" (repositorio)
    private EventoRepository eventoRepository;

    // CUMPLIMIENTO HU-05: Guardar un nuevo evento o torneo
    public Evento crearEvento(Evento evento) {
        // reglas como: "Si el nombre es corto, no guardar"
        return eventoRepository.save(evento);
    }

    // CUMPLIMIENTO HU-08: Listar solo los eventos que están activos
    public List<Evento> listarEventosActivos() {
        return eventoRepository.findByEstado("ACTIVO");
    }

    // CUMPLIMIENTO HU-07: Archivado lógico (No borra -> cambiamos estado)
    public void archivarEvento(Long id) {
        eventoRepository.findById(id).ifPresent(evento -> {
            evento.setEstado(Evento.EstadoEvento.INACTIVO);
            eventoRepository.save(evento);
        });
    }

    // Buscar un evento específico por su ID
    // Útil para mostrar detalles o editar un evento porque si no lo encuentra, devuelve null (podríamos lanzar una excepción en vez)
    public Evento buscarPorId(Long id) {
        return eventoRepository.findById(id).orElse(null);
    }
}