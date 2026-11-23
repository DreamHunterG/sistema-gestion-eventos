package com.sge.backend.services;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfWriter;
import com.sge.backend.entities.Inscripcion; // 🔑 CAMBIO: Ahora usamos Inscripción
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.io.ByteArrayOutputStream;

@Service
public class PDFService {

    @Transactional(readOnly = true)
    public byte[] generarCertificado(Inscripcion ins) { // 🔑 CAMBIO: Recibe Inscripcion
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        // Configuración de márgenes para dar "aire" al diseño (Figma Style)
        Document document = new Document(PageSize.A4.rotate(), 50, 50, 80, 30);

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Configuración de fuentes profesionales
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 40);
            Font subTitleFont = FontFactory.getFont(FontFactory.HELVETICA, 18);
            Font nameFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 42);
            Font eventFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 26);
            Font hashFont = FontFactory.getFont(FontFactory.COURIER, 9);

            // 1. TÍTULO PRINCIPAL
            Paragraph title = new Paragraph("CONSTANCIA DE ASISTENCIA", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingBefore(20);
            document.add(title);

            document.add(new Paragraph("\n\n"));

            // 2. TEXTO DE CONCESIÓN
            Paragraph body = new Paragraph("Se otorga el presente reconocimiento a:", subTitleFont);
            body.setAlignment(Element.ALIGN_CENTER);
            document.add(body);

            // 3. NOMBRE DEL TITULAR (🔑 CAMBIO: Se obtiene desde la entidad Persona)
            // Ya no es ins.getNombreCompleto(), sino ins.getPersona().getNombreCompleto()
            Paragraph name = new Paragraph(ins.getPersona().getNombreCompleto(), nameFont);
            name.setAlignment(Element.ALIGN_CENTER);
            name.setSpacingBefore(30);
            name.setSpacingAfter(30);
            document.add(name);

            // 4. DETALLE DEL LOGRO
            Paragraph detail = new Paragraph("Por su destacada participación y cumplimiento de objetivos en:", subTitleFont);
            detail.setAlignment(Element.ALIGN_CENTER);
            document.add(detail);

            // 5. NOMBRE DEL EVENTO / TORNEO (Obtenido desde la relación)
            Paragraph eventName = new Paragraph("“" + ins.getEvento().getNombre() + "”", eventFont);
            eventName.setAlignment(Element.ALIGN_CENTER);
            eventName.setSpacingBefore(15);
            document.add(eventName);

            // 6. PIE DE PÁGINA: FIRMA DIGITAL (HU-17)
            Paragraph footerSpace = new Paragraph("\n\n\n\n\n");
            document.add(footerSpace);

            Paragraph hashLabel = new Paragraph("Firma Digital de Autenticidad SHA-256:", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9));
            hashLabel.setAlignment(Element.ALIGN_CENTER);
            document.add(hashLabel);

            // El Hash sigue viviendo directamente en la tabla de inscripciones
            Paragraph hashValue = new Paragraph(ins.getCertificadoHash(), hashFont);
            hashValue.setAlignment(Element.ALIGN_CENTER);
            document.add(hashValue);

            document.close();
        } catch (Exception e) {
            throw new RuntimeException("Error crítico en la generación del PDF", e);
        }
        return out.toByteArray();
    }
}