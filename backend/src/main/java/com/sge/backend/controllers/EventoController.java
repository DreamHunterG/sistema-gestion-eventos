package com.sge.backend.controllers;

import com.sge.backend.entities.Evento;
import com.sge.backend.services.EventoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/eventos")
public class EventoController {

    @Autowired
    private EventoService eventoService;

    @PostMapping
    public Evento guardar(@RequestBody Evento evento) {
        return eventoService.guardar(evento); // HU-07: Guardar nuevo evento (siempre inicia como ACTIVO)
    }

    // HU-08: Trae los que están ACTIVO
    @GetMapping
    public List<Evento> listar() {
        return eventoService.listarEventosActivos();
    }

    // 🔑 NUEVO - HU-07: Trae los que están INACTIVO
    @GetMapping("/inactivos")
    public List<Evento> listarInactivos() {
        return eventoService.listarEventosInactivos();
    }

    // HU-07: Cambiar estado (Archivar/Restaurar)
    @DeleteMapping("/{id}")
    public void cambiarEstado(@PathVariable Long id) {
        eventoService.cambiarEstado(id);
    }
}