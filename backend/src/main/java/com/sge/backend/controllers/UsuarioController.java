package com.sge.backend.controllers;

import com.sge.backend.dtos.UsuarioResponse;
import com.sge.backend.entities.Usuario;
import com.sge.backend.services.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {
    @Autowired private UsuarioService usuarioService;

    @GetMapping
    public List<UsuarioResponse> listar() {
        return usuarioService.listarTodos();
    }

    @PostMapping("/registro")
    public UsuarioResponse registrar(@RequestBody Usuario usuario) {
        return usuarioService.registrarUsuario(usuario);
    }

    @PutMapping("/{id}")
    public UsuarioResponse actualizar(@PathVariable Long id, @RequestBody Usuario usuario) {
        return usuarioService.actualizarUsuario(id, usuario);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        usuarioService.cambiarEstado(id);
    }
}