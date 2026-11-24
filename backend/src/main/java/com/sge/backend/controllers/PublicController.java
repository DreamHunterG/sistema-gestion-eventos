package com.sge.backend.controllers;

import com.sge.backend.dtos.CertificadoPublico;
import com.sge.backend.entities.Inscripcion;
import com.sge.backend.repositories.InscripcionRepository;
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
 * Acceso anónimo: cualquiera (por ejemplo, una reclutadora) puede comprobar certificados
 * sin tener cuenta. Solo se muestran certificados emitidos y solo los datos necesarios.
 */
@RestController
@RequestMapping("/api/public")
public class PublicController {

    @Autowired
    private InscripcionRepository repo;

    @Autowired
    private PDFService pdfService;

    // HU-19: Validar autenticidad mediante el código del certificado
    @GetMapping("/validar/{codigo}")
    public ResponseEntity<?> validar(@PathVariable String codigo) {
        return repo.findByCertificadoHash(codigo.trim())
                .<ResponseEntity<?>>map(ins -> ResponseEntity.ok(CertificadoPublico.desde(ins)))
                .orElse(ResponseEntity.status(404).body(Map.of("valido", false, "mensaje", "Código no encontrado")));
    }

    // HU-25: Historial de certificados de una persona (solo los emitidos: la persona asistió)
    @GetMapping("/mis-certificados/{email}")
    public List<CertificadoPublico> buscarPorEmail(@PathVariable String email) {
        return repo.findByPersonaEmailIgnoreCaseAndCertificadoHashIsNotNull(email.trim()).stream()
                .map(CertificadoPublico::desde)
                .toList();
    }

    // Descarga pública por código: imposible de adivinar, a diferencia de un ID 1, 2, 3...
    @GetMapping("/download/{codigo}")
    public ResponseEntity<byte[]> downloadPublico(@PathVariable String codigo) {
        Inscripcion ins = repo.findByCertificadoHash(codigo.trim()).orElse(null);
        if (ins == null) {
            return ResponseEntity.notFound().build();
        }

        byte[] pdf = pdfService.generarCertificado(ins);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        String nombreArchivo = ins.getPersona().getNombreCompleto().replace(" ", "_");
        headers.setContentDispositionFormData("attachment", "Certificado_" + nombreArchivo + ".pdf");

        return ResponseEntity.ok().headers(headers).body(pdf);
    }
}
