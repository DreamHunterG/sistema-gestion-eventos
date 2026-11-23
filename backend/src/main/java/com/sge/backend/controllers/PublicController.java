package com.sge.backend.controllers;

import com.sge.backend.entities.Inscripcion; // 🔑 CAMBIO: Ahora usamos Inscripcion
import com.sge.backend.repositories.InscripcionRepository; // 🔑 CAMBIO: El nuevo repositorio
import com.sge.backend.services.PDFService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Portal Público de Verificación (HU-19, HU-25).
 * Acceso anónimo para validación de certificados y consulta de historial.
 */
@RestController
@RequestMapping("/api/public")
public class PublicController {

    @Autowired
    private InscripcionRepository repo; // Usamos el repositorio de inscripciones

    @Autowired
    private PDFService pdfService;

    // HU-19: Validar autenticidad mediante el código Hash
    @GetMapping("/validar/{hash}")
    public ResponseEntity<?> validar(@PathVariable String hash) {
        return repo.findByCertificadoHash(hash)
                .map(ins -> ResponseEntity.ok(Map.of(
                        "id", ins.getId(),
                        "valido", true,
                        // 🔑 ACCESO NORMALIZADO: ins -> persona -> nombre
                        "participante", ins.getPersona().getNombreCompleto(),
                        "evento", ins.getEvento().getNombre(),
                        "tipo", ins.getEvento().getTipoEvento().name()
                )))
                .orElse(ResponseEntity.status(404).body(Map.of("valido", false, "mensaje", "Código no encontrado")));
    }

    // HU-25: Historial por Persona (Estilo SENA)
    @GetMapping("/mis-certificados/{email}")
    public List<Inscripcion> buscarPorEmail(@PathVariable String email) {
        // El repositorio ya tiene el método para buscar por el email de la tabla Persona
        return repo.findByPersonaEmail(email);
    }

    // Descarga pública (Sin Token)
    @GetMapping("/download/{id}")
    public ResponseEntity<byte[]> downloadPublico(@PathVariable Long id) {
        Inscripcion ins = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Registro no encontrado"));

        byte[] pdf = pdfService.generarCertificado(ins);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        String nombreArchivo = ins.getPersona().getNombreCompleto().replace(" ", "_");
        headers.setContentDispositionFormData("attachment", "Certificado_" + nombreArchivo + ".pdf");

        return ResponseEntity.ok().headers(headers).body(pdf);
    }
}