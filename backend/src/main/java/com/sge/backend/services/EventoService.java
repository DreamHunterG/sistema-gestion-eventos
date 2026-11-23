package com.sge.backend.services;

import com.sge.backend.entities.Evento;
import com.sge.backend.repositories.EventoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class EventoService {

    @Autowired
    private EventoRepository eventoRepository;

    public List<Evento> listarEventosActivos() {
        List<Evento> lista = eventoRepository.findByEstado(Evento.EstadoEvento.ACTIVO);
        // 🔑 Inyectamos el conteo real en el campo transitorio
        lista.forEach(e -> e.setTotalAsistentes(eventoRepository.countAsistentesReal(e.getId())));
        return lista;
    }

    public List<Evento> listarEventosInactivos() {
        List<Evento> lista = eventoRepository.findByEstado(Evento.EstadoEvento.INACTIVO);
        lista.forEach(e -> e.setTotalAsistentes(eventoRepository.countAsistentesReal(e.getId())));
        return lista;
    }

    @Transactional
    public Evento guardar(Evento evento) {
        return eventoRepository.save(evento);
    }

    @Transactional
    public void cambiarEstado(Long id) {
        eventoRepository.findById(id).ifPresent(e -> {
            e.setEstado(e.getEstado() == Evento.EstadoEvento.ACTIVO ?
                    Evento.EstadoEvento.INACTIVO : Evento.EstadoEvento.ACTIVO);
            eventoRepository.save(e);
        });
    }
}