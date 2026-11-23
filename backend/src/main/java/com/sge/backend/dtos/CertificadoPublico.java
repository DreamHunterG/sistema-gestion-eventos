package com.sge.backend.dtos;

import com.sge.backend.entities.Inscripcion;
import java.time.LocalDateTime;

/**
 * Lo que ve cualquier persona (por ejemplo, una reclutadora) al verificar un certificado.
 * Solo lo necesario para comprobarlo: sin IDs internos, sin correo y sin datos de quién creó el evento.
 */
public record CertificadoPublico(
        boolean valido,
        String codigo,
        String participante,
        String evento,
        String tipo,
        LocalDateTime fechaEvento,
        Integer duracion,
        LocalDateTime fechaAsistencia
) {
    public static CertificadoPublico desde(Inscripcion ins) {
        return new CertificadoPublico(
                true,
                ins.getCertificadoHash(),
                ins.getPersona().getNombreCompleto(),
                ins.getEvento().getNombre(),
                ins.getEvento().getTipoEvento().name(),
                ins.getEvento().getFechaEvento(),
                ins.getEvento().getDuracion(),
                ins.getFechaAsistencia()
        );
    }
}
