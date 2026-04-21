package com.sge.backend.controllers;

import com.sge.backend.dtos.AuthResponse;
import com.sge.backend.dtos.LoginRequest;
import com.sge.backend.entities.Usuario;
import com.sge.backend.repositories.UsuarioRepository;
import com.sge.backend.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador de Autenticación.
 * Punto de entrada para la HU-01 (Login).
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        // 1. Busca al usuario en la base de datos por su email
        Usuario usuario = usuarioRepository.findByEmail(loginRequest.getEmail())
                .orElse(null);

        // 2. Valida si existe y si la contraseña coincide (usando BCrypt)
        if (usuario != null && passwordEncoder.matches(loginRequest.getPassword(), usuario.getPassword())) {

            // 3. Si es correcto, genera su "pase VIP" (Token)
            String token = jwtUtils.generarToken(usuario.getEmail());

            // 4. Devuelve /respuesta con el token y datos básicos
            return ResponseEntity.ok(new AuthResponse(token, usuario.getEmail(), usuario.getRol().name()));
        }

        // 5. Si algo falla, devolver error 401 (No autorizado). Es importante no dar detalles para no ayudar a posibles atacantes.
        // pero también es importante dar un mensaje claro para el usuario que sí es auténtico
        //puesto que pueden haber errores en digitacion o olvido de ejemplo: clave
        return ResponseEntity.status(401).body("Error: Credenciales inválidas");
    }
}