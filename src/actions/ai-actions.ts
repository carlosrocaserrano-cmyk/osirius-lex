"use server";

import { getGeminiModel } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";

export async function chatWithAI(message: string, context?: any) {
    try {
        const model = getGeminiModel();

        // System prompt injection
        const systemPrompt = `Actúa como Osirius, un asistente legal experto y eficiente para abogados.
        Tu objetivo es ayudar al abogado a gestionar sus casos, redactar documentos y entender conceptos jurídicos complejos.
        Responde siempre en español, de forma profesional pero directa y concisa.
        Tienes acceso a este contexto (si se proporciona): ${JSON.stringify(context || {})}
        
        Si te preguntan algo fuera del ámbito legal o de la gestión del despacho, responde amablemente que solo estás entrenado para asistencia jurídica.`;

        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: systemPrompt }],
                },
                {
                    role: "model",
                    parts: [{ text: "Entendido. Soy Osirius, tu asistente legal. ¿En qué puedo ayudarte hoy con tus casos o escritos?" }],
                },
            ],
        });

        const result = await chat.sendMessage(message);
        const response = result.response;
        return response.text();
    } catch (error: any) {
        console.error("AI Error:", error);
        return "Lo siento, hubo un error al conectar con mi cerebro digital. Verifica tu API Key o inténtalo más tarde.";
    }
}

export async function summarizeCase(caseId: string) {
    try {
        const caseData = await prisma.case.findUnique({
            where: { id: caseId },
            include: {
                client: true,
                updates: true,
                expenses: true,
                events: true
            }
        });

        if (!caseData) throw new Error("Caso no encontrado");

        const model = getGeminiModel();
        const prompt = `Analiza el siguiente caso legal y genera un RESUMEN EJECUTIVO (máximo 150 palabras) que destaque el estado actual, los próximos pasos críticos y cualquier riesgo financiero.
        
        Datos del Caso:
        ${JSON.stringify(caseData, null, 2)}
        
        Formato de respuesta:
        **Resumen:** [Texto]
        **Próximo Vencimiento:** [Texto si hay eventos, sino "Ninguno"]
        **Estado Financiero:** [Breve comentario sobre gastos vs honorarios si aplica]`;

        const result = await model.generateContent(prompt);
        return result.response.text();

    } catch (error) {
        console.error("AI Summary Error:", error);
        return "No pude generar el resumen en este momento.";
    }
}
