package com.sge.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

@Data
@AllArgsConstructor
public class ImportResponse {
    private int exitosos;
    private int fallidos;
    private List<String> errores; // Ejemplo: "Fila 5: correo duplicado"
}