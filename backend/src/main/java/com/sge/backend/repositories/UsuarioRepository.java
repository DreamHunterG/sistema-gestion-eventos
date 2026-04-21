package com.sge.backend.repositories;

import com.sge.backend.entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    // Poder extra: Buscar un usuario por su correo para el Login (HU-01)
    Optional<Usuario> findByEmail(String email);
}