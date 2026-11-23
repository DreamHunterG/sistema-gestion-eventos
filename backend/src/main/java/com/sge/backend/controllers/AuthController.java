package com.sge.backend.controllers;

import com.sge.backend.dtos.AuthResponse;
import com.sge.backend.dtos.LoginRequest;
import com.sge.backend.entities.Usuario;
import com.sge.backend.entities.Role;
import com.sge.backend.security.JwtUtils;
import com.sge.backend.services.UsuarioService;
import lombok.RequiredArgsConstructor; // 👈 NUEVO
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor // 🔑 SOLUCIÓN: Inyección profesional
public class AuthController {

    private final UsuarioService usuarioService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Usuario usuario = usuarioService.buscarPorEmail(loginRequest.getEmail());

        if (usuario != null && passwordEncoder.matches(loginRequest.getPassword(), usuario.getPassword())) {

            // 🔑 SOLUCIÓN: 'Role::getNombreRol' en lugar de '(role) -> role.getNombreRol()'
            String nombreRol = usuario.getRoles().stream()
                    .map(Role::getNombreRol)
                    .findFirst()
                    .orElse("INVITADO");

            String token = jwtUtils.generarToken(usuario.getEmail(), nombreRol);
            return ResponseEntity.ok(new AuthResponse(token, usuario.getEmail(), nombreRol));
        }
        return ResponseEntity.status(401).body("Credenciales incorrectas");
    }
}