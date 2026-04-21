package com.sge.backend.services;

import com.sge.backend.entities.Usuario;
import com.sge.backend.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder; // REVISA ESTO
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Usuario registrarUsuario(Usuario usuario) {

        String passwordEncriptado = passwordEncoder.encode(usuario.getPassword());
        usuario.setPassword(passwordEncriptado);

        return usuarioRepository.save(usuario);
    } // esta parte sirve para encriptar la contraseña antes de guardarla en la base de datos.
    // En lugar de almacenar la contraseña en texto plano, lo que es un riesgo de seguridad,
    // se utiliza el PasswordEncoder para convertirla en una forma segura (hash).
    // Esto significa que incluso si alguien accede a la base de datos,
    // NO! podrá ver las contraseñas reales, sino solo sus versiones encriptadas.

    public Usuario buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email).orElse(null);
    }
}