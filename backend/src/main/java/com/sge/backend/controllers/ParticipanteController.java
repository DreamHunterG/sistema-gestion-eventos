package com.sge.backend.controllers;

import com.sge.backend.dtos.ImportResponse;
import com.sge.backend.entities.Participante;
import com.sge.backend.services.ParticipanteService;
import com.sge.backend.services.PDFService; // <--- NUEVA IMPORTACIÓN
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity; // <--- NUEVA IMPORTACIÓN
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * Controlador para la gestión de inscripciones y asistencia de participantes.
 * Cumple con HU-09, HU-10, HU-13, HU-14, HU-18.
 */
@RestController
@RequestMapping("/api/participantes")
public class ParticipanteController {

    @Autowired
    private ParticipanteService participanteService;

    @Autowired
    private PDFService pdfService; // Servicio para generar documentos PDF (HU-18)

    // ==========================================================
    // 1. REGISTRO INDIVIDUAL (HU-09)
    // ==========================================================
    @PostMapping
    public Participante inscribir(@RequestBody Participante participante) {
        return participanteService.inscribirParticipante(participante);
    }

    // ==========================================================
    // 2. CHECK-IN (QR / Manual) (HU-13, HU-14)
    // ==========================================================
    @PutMapping("/checkin/{id}")
    public Participante checkin(@PathVariable Long id) {
        return participanteService.registrarAsistencia(id);
    }

    // ==========================================================
    // 3. CARGA MASIVA (CSV) (HU-10, HU-11)
    // ==========================================================
    @PostMapping("/importar/{eventoId}")
    public ImportResponse importar(@RequestParam("file") MultipartFile file, @PathVariable Long eventoId) {
        return participanteService.importarCSV(file, eventoId);
    }

    // ==========================================================
    // 4. DESCARGA DE CERTIFICADO (PDF) (HU-18)
    // ==========================================================
    @GetMapping("/download/{id}")
    public ResponseEntity<byte[]> descargarCertificado(@PathVariable Long id) {
        // Buscamos al participante directamente por ID (más eficiente)
        Participante p = participanteService.buscarParticipantePorId(id); // <--- CAMBIO CLAVE

        // Validación de existencia y asistencia (Regla de Negocio HU-18)
        if (p == null) {
            return ResponseEntity.status(404).body(null); // No encontrado
        }
        if (Boolean.FALSE.equals(p.getAsistio())) {
            return ResponseEntity.status(403).body("El participante no ha registrado asistencia".getBytes()); // No asistió
        }

        byte[] contents = pdfService.generarCertificado(p);

        // Configuración para que el navegador descargue el archivo PDF
        org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.setContentType(org.springframework.http.MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "Certificado_" + p.getNombreCompleto().replace(" ", "_") + ".pdf");
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

        return new ResponseEntity<>(contents, headers, org.springframework.http.HttpStatus.OK);
    }

    // ==========================================================
    // 5. LISTADO DE PARTICIPANTES (HU-12)
    // ==========================================================
    @GetMapping
    public List<Participante> listar() {
        return participanteService.listarInscritos();
    }
}