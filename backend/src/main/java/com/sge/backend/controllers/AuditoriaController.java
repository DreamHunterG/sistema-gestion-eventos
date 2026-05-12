package com.sge.backend.controllers;

import com.sge.backend.entities.Auditoria;
import com.sge.backend.repositories.AuditoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/auditoria")
public class AuditoriaController {
    @Autowired
    private AuditoriaRepository repo;

    @GetMapping
    public List<Auditoria> listar() {
        return repo.findAll(); // Devuelve el rastro de ROOM_911
    }
}