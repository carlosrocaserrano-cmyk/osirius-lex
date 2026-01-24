"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { addXP } from "@/actions/gamification-actions";

export async function getCases() {
    return await prisma.case.findMany({
        orderBy: { updatedAt: 'desc' },
        select: { id: true, caratula: true, expediente: true, juzgado: true, tipo: true, clientId: true }
    });
}

export async function addCaseUpdate(caseId: string, formData: FormData) {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const response = formData.get("response") as string;
    const dateStr = formData.get("date") as string;

    if (!caseId || !title || !description) {
        throw new Error("Missing required fields");
    }

    await prisma.caseUpdate.create({
        data: {
            caseId,
            title,
            description,
            response,
            date: dateStr ? new Date(dateStr) : new Date(),
        }
    });

    revalidatePath(`/expedientes/${caseId}`);
}

export async function convertEventToUpdate(eventId: string, caseId: string, response: string) {
    // Allows converting an agenda event (e.g. Audiencia) into a historical update
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) throw new Error("Event not found");

    await prisma.caseUpdate.create({
        data: {
            caseId,
            title: `[Audiencia] ${event.title}`,
            description: event.description || "Evento de agenda completado",
            response,
            date: event.date
        }
    });

    revalidatePath(`/expedientes/${caseId}`);
}
