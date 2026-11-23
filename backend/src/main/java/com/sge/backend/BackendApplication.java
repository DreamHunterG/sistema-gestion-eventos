package com.sge.backend; // 🔑 Dirección postal raíz del proyecto

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Clase principal de arranque del Sistema de Gestión de Eventos (SGE).
 * Este es el "Cerebro" que enciende todos los módulos del Backend.
 */
@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		// Esta línea activa el motor de Spring Boot y conecta la Base de Datos
		SpringApplication.run(BackendApplication.class, args);
	}

}