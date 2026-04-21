package com.sge.backend.controllers;

import com.sge.backend.entities.Evento;
import com.sge.backend.services.EventoService;
import org.springframework.beans.factory.annotation.Autowired; // Le dice a Spring: "Conecta este controlador con el servicio de eventos para que pueda usar su lógica"
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Ventanilla de atención para la gestión de Eventos.
 * Cumple con HU-05, HU-08.
 */
@RestController // Le dice a Spring: "Este archivo responde peticiones web, es decir, es el encargado de recibir las solicitudes HTTP relacionadas con los eventos y devolver respuestas" o en lenguaje más sencillo:
// "Este es el encargado de manejar todo lo relacionado con los eventos, como crear nuevos eventos, listar los eventos activos y archivar eventos".
@RequestMapping("/api/eventos") // Todas las rutas empezarán por aqui
public class EventoController {

    @Autowired
    private EventoService eventoService;

    // CUMPLIMIENTO HU-05: Crear un evento (Petición POST)
    @PostMapping
    public Evento guardar(@RequestBody Evento evento) {
        return eventoService.crearEvento(evento);
    }

    // CUMPLIMIENTO HU-08: Listar eventos activos (Petición GET)
    @GetMapping
    public List<Evento> listar() {
        return eventoService.listarEventosActivos();
    }

    // CUMPLIMIENTO HU-07: Archivar un evento (Petición DELETE lógico)
    @DeleteMapping("/{id}")
    public void archivar(@PathVariable Long id) {
        eventoService.archivarEvento(id);
    }
}