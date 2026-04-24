package com.sge.backend.services;

import com.sge.backend.entities.Evento;
import com.sge.backend.repositories.EventoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

/**
 * Lógica de negocio para Eventos.
 * Asegura la integridad de los datos de aforo y estado.
 */
@Service
public class EventoService {

    @Autowired
    private EventoRepository eventoRepository;

    // HU-08: Listar Activos con conteo real inyectado desde el Repositorio
    public List<Evento> listarEventosActivos() {
        List<Evento> lista = eventoRepository.findByEstado(Evento.EstadoEvento.ACTIVO);
        lista.forEach(e -> e.setTotalAsistentes(eventoRepository.countAsistentesReal(e.getId())));
        return lista;
    }

    // HU-07: Listar Inactivos (Archivados)
    public List<Evento> listarEventosInactivos() {
        List<Evento> lista = eventoRepository.findByEstado(Evento.EstadoEvento.INACTIVO);
        lista.forEach(e -> e.setTotalAsistentes(eventoRepository.countAsistentesReal(e.getId())));
        return lista;
    }

    // Método universal para guardar (Crear y Editar)
    @Transactional
    public Evento guardar(Evento evento) {
        return eventoRepository.save(evento);
    }

    // Este es el método que tu Controller está pidiendo
    @Transactional
    public Evento crearEvento(Evento evento) {
        return eventoRepository.save(evento);
    }

    @Transactional
    public void cambiarEstado(Long id) {
        eventoRepository.findById(id).ifPresent(e -> {
            if (e.getEstado() == Evento.EstadoEvento.ACTIVO) {
                e.setEstado(Evento.EstadoEvento.INACTIVO);
            } else {
                e.setEstado(Evento.EstadoEvento.ACTIVO);
            }
            eventoRepository.save(e);
        });
    }
}