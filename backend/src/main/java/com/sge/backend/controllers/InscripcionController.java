package com.sge.backend.controllers;

import com.sge.backend.dtos.ImportResponse;
import com.sge.backend.entities.Inscripcion;
import com.sge.backend.services.InscripcionService;
import com.sge.backend.services.PDFService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/participantes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class InscripcionController {

    private final InscripcionService inscripcionService;
    private final PDFService pdfService;

    @GetMapping
    public List<Inscripcion> listar() {
        return inscripcionService.listarTodas();
    }

    @GetMapping("/historial/{email}")
    public List<Inscripcion> historial(@PathVariable String email) {
        return inscripcionService.obtenerHistorial(email);
    }

    @PostMapping("/importar/{eventoId}")
    public ImportResponse importar(@RequestParam("file") MultipartFile file, @PathVariable Long eventoId) {
        return inscripcionService.importarCSV(file, eventoId);
    }

    // ✅ CORREGIDO: Ahora recibe eventoId para cumplir con la firma del Service
    @PutMapping("/checkin/{id}")
    public Inscripcion checkin(@PathVariable Long id, @RequestParam Long eventoId) {
        return inscripcionService.registrarAsistencia(id, eventoId);
    }

    @PostMapping("/manual")
    public Inscripcion registrarManual(@RequestBody Map<String, Object> body) {
        String nombre = (String) body.get("nombreCompleto");
        String email = (String) body.get("email");
        Long eventoId = Long.valueOf(body.get("eventoId").toString());
        return inscripcionService.registroManual(nombre, email, eventoId);
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<byte[]> descargarCertificado(@PathVariable Long id) {
        Inscripcion ins = inscripcionService.buscarInscripcionPorId(id);

        if (ins == null) return ResponseEntity.notFound().build();
        if (Boolean.FALSE.equals(ins.getAsistio())) return ResponseEntity.status(403).build();

        byte[] contents = pdfService.generarCertificado(ins);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        String nombreArchivo = ins.getPersona().getNombreCompleto().replace(" ", "_");
        headers.setContentDispositionFormData("attachment", "Certificado_" + nombreArchivo + ".pdf");

        return ResponseEntity.ok().headers(headers).body(contents);
    }
}