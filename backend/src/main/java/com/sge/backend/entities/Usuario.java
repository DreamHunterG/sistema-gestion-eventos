package com.sge.backend.entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import java.util.HashSet;
import java.util.Set;

/**
 * Entidad Usuario - Versión Final Normalizada (Muchos a Muchos).
 * Solución al error de mapeo de tablas intermedias.
 */
@Entity
@Table(name = "usuarios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String email;
    private String rol;

    // 🔐 Se puede recibir en un JSON (crear/editar), pero nunca se envía en una respuesta
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;
    private String estado = "ACTIVO";

    // 🔑 RELACIÓN MUCHOS A MUCHOS (Corregida)
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "usuarios_roles",
            joinColumns = @JoinColumn(name = "id_usuario"),
            inverseJoinColumns = @JoinColumn(name = "id_rol") // 👈 CORREGIDO: 'joinColumns' en lugar de 'highlight'
    )
    private Set<Role> roles = new HashSet<>();

    // 🔑 MÉTODO PUENTE: Soluciona el error "Cannot resolve method getRol"
    // Este método permite que el resto del código siga funcionando en singular
    public String getRol() {
        // 1. Si la lista de roles de la DB tiene algo, devolvemos eso
        if (this.roles != null && !this.roles.isEmpty()) {
            return this.roles.iterator().next().getNombreRol();
        }
        // 2. Si la lista está vacía pero el campo 'rol' tiene texto (viene del front), devolvemos ese texto
        if (this.rol != null) {
            return this.rol;
        }
        // 3. Solo si no hay nada de nada, devolvemos el valor por defecto
        return "INVITADO";
    }
}