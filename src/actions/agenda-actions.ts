"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getEvents(start: Date, end: Date) {
    return await prisma.event.findMany({
        where: {
            date: {
                gte: start,
                lte: end
            }
        },
        include: { client: true, case: true },
        orderBy: { date: 'asc' }
    });
}

export async function createEvent(formData: FormData) {
    const title = formData.get("title") as string;
    const dateStr = formData.get("date") as string;
    const timeStr = formData.get("time") as string;
    const type = formData.get("type") as string;
    const description = formData.get("description") as string;
    const clientId = formData.get("clientId") as string;
    const caseId = formData.get("caseId") as string;

    if (!title || !dateStr || !timeStr || !type) {
        throw new Error("Missing required fields");
    }

    // Combine date and time
    const dateTime = new Date(`${dateStr}T${timeStr}:00`);

    await prisma.event.create({
        data: {
            title,
            date: dateTime,
            type,
            description,
            clientId: clientId || null,
            caseId: caseId || null,
            status: 'Pendiente'
        }
    });

    revalidatePath("/agenda");
    revalidatePath("/");
}

export async function getUpcomingUrgentEvents() {
    const today = new Date();
    const threeDaysLater = new Date();
    threeDaysLater.setDate(today.getDate() + 3);

    return await prisma.event.findMany({
        where: {
            date: {
                gte: today,
                lte: threeDaysLater
            },
            status: 'Pendiente'
        },
        orderBy: { date: 'asc' },
        include: { case: true }
    });
}
