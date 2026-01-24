import jsPDF from "jspdf";
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, HeadingLevel, BorderStyle } from "docx";
import { saveAs } from "file-saver";

export const generatePDFReport = (caseData: any, updates: any[], userSettings: any) => {
    const doc = new jsPDF();

    // -- Header --
    // Firm Name / Logo placeholder
    doc.setFontSize(18);
    doc.text(userSettings.firmName || "ESTUDIO JURÍDICO", 20, 20);

    doc.setFontSize(10);
    doc.text(userSettings.name || "", 20, 28);
    doc.text(userSettings.address || "", 20, 33);
    doc.text(`Email: ${userSettings.email || ""} | Tel: ${userSettings.phone || ""}`, 20, 38);

    doc.setLineWidth(0.5);
    doc.line(20, 42, 190, 42);

    // -- Case Info --
    doc.setFontSize(14);
    doc.text("INFORME DE ESTADO PROCESAL", 105, 55, { align: "center" });

    doc.setFontSize(11);
    doc.text(`Carátula: ${caseData.caratula}`, 20, 70);
    doc.text(`Expediente N°: ${caseData.expediente || "S/D"}`, 20, 78);
    doc.text(`Juzgado: ${caseData.juzgado || "S/D"}`, 20, 86);
    doc.text(`Cliente: ${caseData.client.name}`, 120, 70);
    doc.text(`Fecha de Informe: ${new Date().toLocaleDateString()}`, 120, 78);

    // -- Timeline Table --
    let yPos = 100;

    doc.setFillColor(240, 240, 240); // header bg
    doc.rect(20, yPos - 5, 170, 8, 'F');
    doc.setFont("helvetica", "bold");
    doc.text("FECHA", 22, yPos);
    doc.text("GESTIÓN / MOVIMIENTO", 50, yPos);
    doc.text("RESPUESTA / ESTADO", 140, yPos);

    doc.setFont("helvetica", "normal");
    yPos += 10;

    updates.forEach((item) => {
        // Date
        const dateStr = new Date(item.date).toLocaleDateString();
        doc.text(dateStr, 22, yPos);

        // Movement (Title + Desc)
        // Wrapped text
        const titleLines = doc.splitTextToSize(item.title, 80);
        doc.setFont("helvetica", "bold");
        doc.text(titleLines, 50, yPos);
        const titleOffset = titleLines.length * 4;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        const descLines = doc.splitTextToSize(item.description, 80);
        doc.text(descLines, 50, yPos + titleOffset + 1);

        // Response
        if (item.response) {
            const respLines = doc.splitTextToSize(item.response, 45);
            doc.text(respLines, 140, yPos);
        }

        // Calculating next Y position based on tallest column
        const movementHeight = (titleLines.length * 4) + (descLines.length * 4) + 2;
        const responseHeight = item.response ? (doc.splitTextToSize(item.response, 45).length * 4) : 0;
        const rowHeight = Math.max(movementHeight, responseHeight, 15);

        doc.setDrawColor(200, 200, 200);
        doc.line(20, yPos + rowHeight - 3, 190, yPos + rowHeight - 3); // separator

        yPos += rowHeight + 2;

        // Page break check
        if (yPos > 270) {
            doc.addPage();
            yPos = 20;
        }
    });

    // Save
    doc.save(`Informe_${caseData.caratula.substring(0, 15)}.pdf`);
};

export const generateWordReport = (caseData: any, updates: any[], userSettings: any) => {
    // Basic implementation for Word
    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                new Paragraph({
                    text: userSettings.firmName || "OSIRIUS LEX REPORT",
                    heading: HeadingLevel.HEADING_1,
                }),
                new Paragraph({ text: `Abogado: ${userSettings.name || ""}` }),
                new Paragraph({ text: `Fecha: ${new Date().toLocaleDateString()}` }),
                new Paragraph({ text: "" }), // spacer
                new Paragraph({
                    text: `INFORME: ${caseData.caratula}`,
                    heading: HeadingLevel.HEADING_2,
                }),
                new Paragraph({ text: `Expediente: ${caseData.expediente} | Juzgado: ${caseData.juzgado}` }),
                new Paragraph({ text: "" }), // spacer

                // Table
                new Table({
                    rows: [
                        new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph({ text: "FECHA", style: "strong" })], width: { size: 20, type: WidthType.PERCENTAGE } }),
                                new TableCell({ children: [new Paragraph({ text: "DETALLE DE GESTIÓN", style: "strong" })], width: { size: 50, type: WidthType.PERCENTAGE } }),
                                new TableCell({ children: [new Paragraph({ text: "RESPUESTA", style: "strong" })], width: { size: 30, type: WidthType.PERCENTAGE } }),
                            ],
                        }),
                        ...updates.map(u => new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph(new Date(u.date).toLocaleDateString())] }),
                                new TableCell({
                                    children: [
                                        new Paragraph({ text: u.title, style: "strong" }),
                                        new Paragraph(u.description)
                                    ]
                                }),
                                new TableCell({ children: [new Paragraph(u.response || "-")] }),
                            ]
                        }))
                    ],
                }),
            ],
        }],
    });

    Packer.toBlob(doc).then((blob) => {
        saveAs(blob, `Informe_${caseData.caratula}.docx`);
    });
};
