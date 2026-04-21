package com.sge.backend.controllers;

import com.sge.backend.repositories.ParticipanteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/public")
public class PublicController {

    @Autowired
    private ParticipanteRepository repo;

    @GetMapping("/validar/{hash}")
    public ResponseEntity<?> validar(@PathVariable String hash) {
        return repo.findByCertificadoHash(hash)
                .map(p -> ResponseEntity.ok(Map.of(
                        "valido", true,
                        "participante", p.getNombreCompleto(),
                        "evento", p.getEvento().getNombre(),
                        "tipo", p.getEvento().getTipoEvento()
                )))
                .orElse(ResponseEntity.status(404).body(Map.of("valido", false, "mensaje", "Certificado no encontrado")));
    }
}