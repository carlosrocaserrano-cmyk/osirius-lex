
import { jsPDF } from "jspdf";

export const BRANDING = {
    firmName: "ROCA.S. Estudio de Abogados",
    slogan: "Excelencia y Estrategia Legal",
    colors: {
        primary: "#1a1a20", // Dark Background
        accent: "#84cc16", // Lime-500 equivalent
        text: "#000000",
        lightText: "#6b7280"
    },
    fonts: {
        header: "Helvetica",
        body: "Times"
    }
};

/**
 * Injects the official ROCA.S. header into a jsPDF instance.
 */
export function injectHeader(doc: jsPDF, docTitle: string) {
    const pageWidth = doc.internal.pageSize.getWidth();

    // -- Top Bar --
    doc.setFillColor(30, 30, 35); // Dark grey
    doc.rect(0, 0, pageWidth, 25, 'F');

    // -- Brand Name --
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(BRANDING.firmName.toUpperCase(), 15, 12);

    // -- Slogan --
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(132, 204, 22); // Lime accent
    doc.text(BRANDING.slogan, 15, 18);

    // -- Document Title --
    doc.setTextColor(0, 0, 0);
    doc.setFont("times", "bold"); // Judicial style
    doc.setFontSize(14);
    doc.text(docTitle.toUpperCase(), pageWidth / 2, 40, { align: 'center' });

    // -- Divider --
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 45, pageWidth - 20, 45);
}

/**
 * Injects a security watermark/hash at the bottom.
 */
export function injectFooter(doc: jsPDF, hash?: string) {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);

    const footerText = `Generado por Osirius Lex AI • ${new Date().toLocaleString()}`;
    doc.text(footerText, 15, pageHeight - 10);

    if (hash) {
        doc.setFont("courier", "normal");
        doc.text(`HASH: ${hash}`, pageWidth - 15, pageHeight - 10, { align: 'right' });
    }
}
