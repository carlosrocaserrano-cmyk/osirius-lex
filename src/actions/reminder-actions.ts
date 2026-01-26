"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createReminder(data: {
    title: string;
    description?: string;
    date: Date;
    type: string;
}) {
    try {
        await prisma.event.create({
            data: {
                title: data.title,
                description: data.description,
                date: data.date,
                type: data.type, // 'reunion', 'audiencia', 'otro'
                status: 'Pendiente'
            }
        });
        revalidatePath("/dashboard");
        revalidatePath("/agenda");
        return { success: true };
    } catch (error) {
        console.error("Error creating reminder:", error);
        return { success: false, error: "Failed to create reminder" };
    }
}
