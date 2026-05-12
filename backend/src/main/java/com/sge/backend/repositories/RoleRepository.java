package com.sge.backend.repositories;

import com.sge.backend.entities.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    // 🔑 Busca el objeto Role real usando la palabra "ADMIN" o "MONITOR"
    Optional<Role> findByNombreRol(String nombreRol);
}