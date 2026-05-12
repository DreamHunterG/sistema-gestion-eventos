package com.sge.backend.services;

import com.sge.backend.dtos.UsuarioResponse;
import com.sge.backend.entities.Usuario;
import com.sge.backend.entities.Role;
import com.sge.backend.repositories.UsuarioRepository;
import com.sge.backend.repositories.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioService {
    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private RoleRepository roleRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public List<UsuarioResponse> listarTodos() {
        return usuarioRepository.findAll().stream()
                .map(u -> new UsuarioResponse(
                        u.getId(),
                        u.getNombre(),
                        u.getEmail(),
                        u.getRol(),
                        u.getEstado()
                )).collect(Collectors.toList());
    }

    @Transactional
    public Usuario registrarUsuario(Usuario data) {
        data.setPassword(passwordEncoder.encode(data.getPassword()));
        data.setEstado("ACTIVO");

        // 🔑 Guardamos el rol que elegiste
        String nombreRol = data.getRol();
        if (nombreRol != null) {
            roleRepository.findByNombreRol(nombreRol).ifPresent(r -> {
                data.getRoles().clear();
                data.getRoles().add(r);
            });
        }
        return usuarioRepository.save(data);
    }

    @Transactional
    public Usuario actualizarUsuario(Long id, Usuario data) {
        return usuarioRepository.findById(id).map(u -> {
            u.setNombre(data.getNombre());
            u.setEmail(data.getEmail());

            // 🔑 Actualizamos el rol al que elegiste en el editor
            if (data.getRol() != null) {
                roleRepository.findByNombreRol(data.getRol()).ifPresent(r -> {
                    u.getRoles().clear();
                    u.getRoles().add(r);
                });
            }

            if (data.getPassword() != null && !data.getPassword().isEmpty()) {
                u.setPassword(passwordEncoder.encode(data.getPassword()));
            }
            return usuarioRepository.save(u);
        }).orElse(null);
    }

    @Transactional
    public void cambiarEstado(Long id) {
        usuarioRepository.findById(id).ifPresent(u -> {
            String nuevoEstado = u.getEstado().equals("ACTIVO") ? "INACTIVO" : "ACTIVO";
            u.setEstado(nuevoEstado);
            usuarioRepository.save(u);
        });
    }

    public Usuario buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email).orElse(null);
    }
}