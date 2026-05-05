package com.sge.backend.services;

import com.sge.backend.entities.Evento;
import com.sge.backend.repositories.EventoRepository;
import com.sge.backend.dtos.ImportResponse;
import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Importante para la integridad de datos
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

/**
 * Lógica de negocio centralizada para la gestión de participantes.
 * Implementa: Registro manual, Carga masiva (CSV), Check-in criptográfico y Auditoría.
 * Cumple con HU-09, 10, 11, 13, 14, 17, 18 y 24.
 */
@Service
public class ParticipanteService {

    @Autowired
    private ParticipanteRepository participanteRepository;

    @Autowired
    private EventoRepository eventoRepository;

    @Autowired
    private CryptoService cryptoService; // Motor de firma digital (HU-17)

    // ==========================================================
    // 1. REGISTRO INDIVIDUAL (HU-09 y HU-24)
    // ==========================================================
    @Transactional
    public Participante inscribirParticipante(Participante participante) {
        // Validación de integridad: un email no puede estar dos veces en el mismo evento
        boolean yaExiste = participanteRepository.existsByEmailAndEventoId(
                participante.getEmail(),
                participante.getEvento().getId()
        );

        if (yaExiste) {
            throw new RuntimeException("Error: El correo " + participante.getEmail() + " ya está inscrito en este evento.");
        }

        return participanteRepository.save(participante);
    }

    // ==========================================================
    // 2. CHECK-IN Y FIRMA DIGITAL (HU-13, 14 y 17)
    // ==========================================================
    @Transactional
    public Participante registrarAsistencia(Long id) {
        return participanteRepository.findById(id).map(participante -> {
            // Regla de negocio: Si ya asistió, no regeneramos el hash para mantener integridad
            if (Boolean.TRUE.equals(participante.getAsistio())) {
                return participante;
            }

            // Marcamos la asistencia (HU-13/14)
            participante.setAsistio(true);

            // Generamos la firma inmutable SHA-256 (HU-17)
            // Usamos Email + ID del Evento para asegurar que el hash sea único por inscripción
            String hashUnico = cryptoService.generarFirmaDigital(
                    participante.getEmail(),
                    participante.getEvento().getId()
            );
            participante.setCertificadoHash(hashUnico);

            return participanteRepository.save(participante);
        }).orElseThrow(() -> new RuntimeException("Participante no encontrado con ID: " + id));
    }

    // ==========================================================
    // 3. CARGA MASIVA DE COMUNIDADES (HU-10 y HU-11)
    // ==========================================================
    @Transactional
    public ImportResponse importarCSV(MultipartFile archivo, Long eventoId) {
        int exitosos = 0;
        int fallidos = 0;
        List<String> detalleErrores = new ArrayList<>();

        // Validación de existencia del evento contenedor
        Evento evento = eventoRepository.findById(eventoId)
                .orElseThrow(() -> new RuntimeException("El evento destino no existe."));

        try (CSVReader reader = new CSVReaderBuilder(new InputStreamReader(archivo.getInputStream()))
                .withSkipLines(1) // Ignoramos los encabezados del archivo
                .build()) {

            String[] fila;
            while ((fila = reader.readNext()) != null) {
                try {
                    // Validación de línea vacía para evitar errores de índice
                    if (fila.length < 2 || fila[0].trim().isEmpty()) continue;

                    String nombre = fila[0];
                    String email = fila[1];

                    // Aplicamos validación de duplicados (HU-24)
                    if (participanteRepository.existsByEmailAndEventoId(email, eventoId)) {
                        fallidos++;
                        detalleErrores.add("Fila con email [" + email + "] omitida: Ya está registrado.");
                        continue;
                    }

                    Participante nuevo = new Participante();
                    nuevo.setNombreCompleto(nombre);
                    nuevo.setEmail(email);
                    nuevo.setEvento(evento);
                    nuevo.setAsistio(false);

                    participanteRepository.save(nuevo);
                    exitosos++;

                } catch (Exception e) {
                    fallidos++;
                    detalleErrores.add("Error procesando registro: " + e.getMessage());
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Falla crítica al leer el archivo CSV", e);
        }

        return new ImportResponse(exitosos, fallidos, detalleErrores);
    }

    // ==========================================================
    // 4. CONSULTAS (HU-12, 18, 19)
    // ==========================================================

    // Listado completo de la tabla
    public List<Participante> listarInscritos() {
        return participanteRepository.findAll();
    }

    // Búsqueda específica por ID (Necesaria para descargar el PDF)
    public Participante buscarParticipantePorId(Long id) {
        return participanteRepository.findById(id).orElse(null);
    }
}