
import { jsPDF } from "jspdf";
import { injectHeader, injectFooter } from "@/lib/legal/branding";

interface ContractData {
    clientName: string;
    clientDoc?: string; // CI/NIT
    clientAddress?: string;
    clientRep?: string; // Representative if Company
    startDate: Date;
    amount?: number;
    // Case specifics
    caseCaratula?: string;
    caseExpediente?: string;
    caseJuzgado?: string;
    caseNurej?: string;
}

export function generateIgualaContract(data: ContractData): Blob {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);

    // 1. Branding (ROCA.S header)
    injectHeader(doc, "CONTRATO DE IGUALA PROFESIONAL");

    let yPos = 60;
    const lineHeight = 6;

    // Helper to add text
    doc.setFont("times", "normal");
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);

    const addParagraph = (text: string, isBold: boolean = false, align: 'left' | 'center' | 'justify' = 'justify') => {
        if (isBold) doc.setFont("times", "bold");
        else doc.setFont("times", "normal");

        const lines = doc.splitTextToSize(text, contentWidth);
        doc.text(lines, margin, yPos, { align: align === 'justify' ? 'left' : align, maxWidth: contentWidth });
        yPos += lines.length * lineHeight + 4;

        if (yPos > 260) {
            injectFooter(doc, "PAGE-" + doc.getNumberOfPages());
            doc.addPage();
            yPos = 30;
        }
    };

    // -- INTRO --
    addParagraph("Conste por el presente documento privado un Contrato de Iguala Profesional para servicios de defensa y representación legal, que una vez reconocido ante autoridad competente, tendrá el valor de documento público. Se suscribe al tenor de las siguientes cláusulas;", false);

    // -- PARTIES --
    const lawyerText = "De una parte: El Abg. Carlos René Rubén Roca Serrano, con Cédula de Identidad N° 5880716, con Registro Público de la Abogacía N° 5880716-CRRRS, mayor de edad y hábil por derecho, con domicilio en el edificio Zero PB-8, calle Aurelio Durán esquina Pasillo Landívar, de la ciudad de Santa Cruz de la Sierra, en adelante denominado el \"PATROCINANTE\".";
    addParagraph(lawyerText);

    // Dynamic Client Text
    let clientText = "Y de la otra parte: ";
    if (data.clientRep) {
        // Company logic from template
        clientText += `El/La ${data.clientRep}, mayor de edad y hábil por derecho, en su condición de representante legal de la empresa ${data.clientName.toUpperCase()}`;
        if (data.clientDoc) clientText += `, con NIT/CI ${data.clientDoc}`;
    } else {
        // Individual logic
        clientText += `El/La Sr(a). ${data.clientName.toUpperCase()}, mayor de edad y hábil por derecho`;
        if (data.clientDoc) clientText += `, con Cédula de Identidad N° ${data.clientDoc}`;
    }
    clientText += `, en adelante denominado el "PATROCINADO".`;
    addParagraph(clientText);

    addParagraph("Ambas partes acuerdan suscribir el presente Contrato de Iguala Profesional, sujeto a las siguientes cláusulas y condiciones:");

    // -- CLAUSES --
    addParagraph("PRIMERA: OBJETO DEL CONTRATO", true);

    let objectText = "";
    if (data.caseCaratula) {
        objectText = `El PATROCINANTE se compromete a prestar los servicios profesionales de asesoría, patrocinio y representación legal en el Proceso ${data.caseCaratula}, tramitado en el ${data.caseJuzgado || "Juzgado competente"}`;
        if (data.caseNurej) objectText += `, con NUREJ N° ${data.caseNurej}`;
        if (data.caseExpediente) objectText += ` y expediente N° ${data.caseExpediente}`;
        objectText += `. La asistencia incluye la defensa integral de los derechos e intereses del PATROCINADO, abarcando todas las gestiones desde la presentación de la contestación a la demanda hasta la obtención de la sentencia de primera instancia.`;
    } else {
        objectText = "El PATROCINANTE se compromete a prestar los servicios profesionales de asesoría legal general y representación en los asuntos que el PATROCINADO le encomiende, actuando con la diligencia y responsabilidad que la profesión exige.";
    }
    addParagraph(objectText);

    addParagraph("SEGUNDA: HONORARIOS PROFESIONALES", true);
    let feesText = `El PATROCINADO se compromete a pagar al PATROCINANTE por los servicios la suma total de Bs. ${(data.amount || 0).toLocaleString()} (00/100 Bolivianos), distribuidos de la siguiente manera:`;
    addParagraph(feesText);

    // Installments (Placeholder based on input)
    // Ideally we iterate over Plan Installments here
    addParagraph("a) Un pago inicial a la firma del presente contrato.");
    addParagraph(`b) El saldo se cubrirá en cuotas mensuales según el plan de pagos acordado.`);

    addParagraph("Los pagos serán acreditados mediante recibos emitidos por el PATROCINANTE, los cuales constituirán plena prueba del cumplimiento de la obligación.");

    addParagraph("TERCERA: GASTOS ADICIONALES", true);
    addParagraph("El presente contrato cubre únicamente los honorarios profesionales del PATROCINANTE. Todos los costos relacionados con tasas judiciales, peritajes, notificaciones, fotocopias, legalizaciones, u otros gastos que surjan durante el proceso judicial serán de cuenta exclusiva del PATROCINADO.");

    // Standard Clauses
    addParagraph("CUARTA: ARBITRAJE Y CONCILIACIÓN", true);
    addParagraph("Toda controversia derivada de este contrato será sometida a Conciliación conforme a la normativa vigente. En caso de persistir el conflicto, se acudirá a la vía judicial competente.");

    addParagraph("QUINTA: CONFORMIDAD", true);
    addParagraph("Ambas partes, en señal de plena conformidad con todas y cada una de las cláusulas precedentes, firman al pie del presente documento.");

    // -- SIGNATURES --
    yPos += 25;
    if (yPos > 270) { doc.addPage(); yPos = 40; }

    doc.line(margin + 10, yPos, margin + 70, yPos);
    doc.text("PATROCINANTE", margin + 25, yPos + 5);

    doc.line(pageWidth - margin - 70, yPos, pageWidth - margin - 10, yPos);
    doc.text("PATROCINADO", pageWidth - margin - 55, yPos + 5);

    // 3. Footer
    injectFooter(doc, "HASH-SECURE-VERIFIED");

    return doc.output('blob');
}
