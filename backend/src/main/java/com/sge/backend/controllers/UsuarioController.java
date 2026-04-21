package com.sge.backend.controllers;

import com.sge.backend.entities.Usuario;
import com.sge.backend.services.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * Ventanilla para la gestión de cuentas y roles.
 * Cumple con HU-02 (Gestión de perfiles).
 */
@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    // CUMPLIMIENTO HU-02: Registrar un nuevo integrante del equipo
    @PostMapping("/registro")
    public Usuario registrar(@RequestBody Usuario usuario) {
        // Nota: Por ahora la contraseña se guarda en texto plano.
        // En la siguiente hora (Seguridad) activaremos el encriptado.
        return usuarioService.registrarUsuario(usuario);
    }

    // Buscar un usuario por su correo esto
    @GetMapping("/{email}")
    public Usuario obtenerPorEmail(@PathVariable String email) {
        return usuarioService.buscarPorEmail(email);
    }
}