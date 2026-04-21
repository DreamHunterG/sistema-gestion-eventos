package com.sge.backend.services;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfWriter;
import com.sge.backend.entities.Participante;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.io.ByteArrayOutputStream;

@Service
public class PDFService {

    @Transactional(readOnly = true) // Evita errores al leer el nombre del evento
    public byte[] generarCertificado(Participante p) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4.rotate()); // Formato Diploma

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Fuentes profesionales
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 36);
            Font subTitleFont = FontFactory.getFont(FontFactory.HELVETICA, 20);
            Font hashFont = FontFactory.getFont(FontFactory.COURIER, 10);

            // Título
            Paragraph title = new Paragraph("CERTIFICADO DE EXCELENCIA", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingBefore(50);
            document.add(title);

            document.add(new Paragraph("\n\n"));

            // Cuerpo del texto
            Paragraph body = new Paragraph("Se otorga el presente reconocimiento a:", subTitleFont);
            body.setAlignment(Element.ALIGN_CENTER);
            document.add(body);

            // Nombre del Participante
            Paragraph name = new Paragraph(p.getNombreCompleto(), FontFactory.getFont(FontFactory.HELVETICA_BOLD, 40));
            name.setAlignment(Element.ALIGN_CENTER);
            name.setSpacingBefore(20);
            document.add(name);

            document.add(new Paragraph("\n"));

            // Detalle del Evento
            Paragraph detail = new Paragraph("Por su destacada participación en el evento/torneo:", subTitleFont);
            detail.setAlignment(Element.ALIGN_CENTER);
            document.add(detail);

            Paragraph eventName = new Paragraph(p.getEvento().getNombre(), FontFactory.getFont(FontFactory.HELVETICA_BOLD, 24));
            eventName.setAlignment(Element.ALIGN_CENTER);
            document.add(eventName);

            // Firma Digital (HU-17)
            Paragraph hashLabel = new Paragraph("\n\n\n\nFirma Digital de Autenticidad (SHA-256):", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10));
            hashLabel.setAlignment(Element.ALIGN_CENTER);
            document.add(hashLabel);

            Paragraph hashValue = new Paragraph(p.getCertificadoHash(), hashFont);
            hashValue.setAlignment(Element.ALIGN_CENTER);
            document.add(hashValue);

            document.close();
        } catch (Exception e) {
            throw new RuntimeException("Error creando el PDF", e);
        }
        return out.toByteArray();
    }
}