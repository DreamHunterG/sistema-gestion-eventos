package com.sge.backend.services;

import com.sge.backend.dtos.ImportResponse;
import com.sge.backend.entities.Auditoria;
import com.sge.backend.entities.Evento;
import com.sge.backend.entities.Inscripcion;
import com.sge.backend.entities.Persona;
import com.sge.backend.repositories.AuditoriaRepository;
import com.sge.backend.repositories.EventoRepository;
import com.sge.backend.repositories.InscripcionRepository;
import com.sge.backend.repositories.PersonaRepository;
import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InscripcionService {

    private final InscripcionRepository inscripcionRepository;
    private final PersonaRepository personaRepository;
    private final EventoRepository eventoRepository;
    private final CryptoService cryptoService;
    private final AuditoriaRepository auditoriaRepository;

    @Transactional
    public Inscripcion registroManual(String nombre, String email, Long eventoId) {
        String responsable = SecurityContextHolder.getContext().getAuthentication().getName();
        Persona persona = personaRepository.findByEmail(email)
                .orElseGet(() -> personaRepository.save(new Persona(null, nombre, email)));

        if (inscripcionRepository.existsByPersonaIdAndEventoId(persona.getId(), eventoId)) {
            throw new RuntimeException("Este participante ya se encuentra registrado en el evento.");
        }

        Inscripcion nueva = new Inscripcion();
        nueva.setPersona(persona);
        nueva.setEvento(eventoRepository.findById(eventoId).orElseThrow());
        nueva.setAsistio(false);

        auditoriaRepository.save(new Auditoria(responsable, "INSERT", "INSCRIPCION", "Registro manual de: " + nombre));
        return inscripcionRepository.save(nueva);
    }

    // ✅ AÑADIDO: Método para importar CSV que el Controller necesita
    @Transactional
    public ImportResponse importarCSV(MultipartFile archivo, Long eventoId) {
        int exitosos = 0; int fallidos = 0;
        List<String> errores = new ArrayList<>();
        Evento evento = eventoRepository.findById(eventoId).orElseThrow();

        try (CSVReader reader = new CSVReaderBuilder(new InputStreamReader(archivo.getInputStream())).withSkipLines(1).build()) {
            String[] fila;
            while ((fila = reader.readNext()) != null) {
                try {
                    String nombre = fila[0]; String email = fila[1];
                    Persona p = personaRepository.findByEmail(email).orElseGet(() -> personaRepository.save(new Persona(null, nombre, email)));
                    Inscripcion ins = new Inscripcion();
                    ins.setPersona(p); ins.setEvento(evento); ins.setAsistio(false);
                    inscripcionRepository.save(ins);
                    exitosos++;
                } catch (Exception e) { fallidos++; errores.add(e.getMessage()); }
            }
        } catch (Exception e) { throw new RuntimeException(e); }
        return new ImportResponse(exitosos, fallidos, errores);
    }

    @Transactional
    public Inscripcion registrarAsistencia(Long id, Long eventoId) {
        // 1. Buscamos la inscripción que coincida con el ID y el Evento (Seguridad)
        Inscripcion ins = inscripcionRepository.findByIdAndEventoId(id, eventoId)
                .orElseThrow(() -> new RuntimeException("Código no válido para este evento"));

        // 2. Si ya asistió, no hacemos nada (Integridad)
        if (Boolean.TRUE.equals(ins.getAsistio())) {
            return ins;
        }

        // 3. MARCAMOS ASISTENCIA REAL
        ins.setAsistio(true);
        ins.setFechaAsistencia(java.time.LocalDateTime.now()); // 🔑 ANOTAMOS LA HORA

        // 4. GENERAMOS FIRMA DIGITAL
        String hash = cryptoService.generarFirmaDigital(ins.getPersona().getEmail(), eventoId);
        ins.setCertificadoHash(hash);

        return inscripcionRepository.save(ins);
    }

    // ✅ AÑADIDO: Método de búsqueda que el Controller necesita para el PDF
    public Inscripcion buscarInscripcionPorId(Long id) {
        return inscripcionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inscripción no encontrada"));
    }

    public List<Inscripcion> obtenerHistorial(String email) {
        return inscripcionRepository.findByPersonaEmail(email);
    }

    public List<Inscripcion> listarTodas() {
        return inscripcionRepository.findAll();
    }
}