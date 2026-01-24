"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { renderTemplate, extractVariables } from "@/lib/docs/template-engine";

// --- Templates ---

export async function createTemplate(data: { name: string; category: string; content: string }) {
    const variables = extractVariables(data.content);

    await prisma.template.create({
        data: {
            name: data.name,
            category: data.category,
            content: data.content,
            variables: JSON.stringify(variables)
        }
    });
    revalidatePath("/documentos");
}

export async function getTemplates() {
    return await prisma.template.findMany({
        orderBy: { name: 'asc' }
    });
}

// --- Documents ---

export async function generateDocument(templateId: string, contextData: { clientId?: string; caseId?: string; customData?: Record<string, any> }) {
    const template = await prisma.template.findUnique({ where: { id: templateId } });
    if (!template) throw new Error("Template not found");

    let data: Record<string, any> = { ...contextData.customData };

    // Fetch Client Data if provided
    if (contextData.clientId) {
        const client = await prisma.client.findUnique({ where: { id: contextData.clientId } });
        if (client) {
            data = {
                ...data,
                client_name: client.name,
                client_email: client.email || "",
                client_phone: client.phone || "",
                client_address: client.address || "",
                doc_number: client.identityDoc || "",
            };
        }
    }

    // Fetch Case Data if provided
    if (contextData.caseId) {
        const caseData = await prisma.case.findUnique({ where: { id: contextData.caseId } });
        if (caseData) {
            data = {
                ...data,
                case_caratula: caseData.caratula,
                case_expediente: caseData.expediente || "",
                case_juzgado: caseData.juzgado || "",
                case_type: caseData.tipo || ""
            };
        }
    }

    // Current Date
    data.date = new Date().toLocaleDateString();

    // Render
    const renderedContent = renderTemplate(template.content, data);

    // Save Document Record
    const doc = await prisma.document.create({
        data: {
            name: `${template.name} - ${data.client_name || 'Sin Cliente'} - ${new Date().toLocaleDateString()}`,
            type: 'generated',
            content: renderedContent,
            generatedFromId: template.id,
            clientId: contextData.clientId
        }
    });

    revalidatePath("/documentos");
    if (contextData.clientId) revalidatePath(`/clientes/${contextData.clientId}`);

    return { success: true, documentId: doc.id, content: renderedContent };
}


export async function getDocuments() {
    return await prisma.document.findMany({
        orderBy: { date: 'desc' },
        include: { client: true, template: true }
    });
}
