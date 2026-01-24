"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type NotificationType = 'INFO' | 'WARNING' | 'ALERT' | 'SUCCESS';

export async function getNotifications() {
    return await prisma.notification.findMany({
        orderBy: { createdAt: 'desc' },
        take: 20
    });
}

export async function markAsRead(id: string) {
    await prisma.notification.update({
        where: { id },
        data: { read: true }
    });
    revalidatePath("/");
}

export async function clearAllNotifications() {
    await prisma.notification.updateMany({
        where: { read: false },
        data: { read: true }
    });
    revalidatePath("/");
}

export async function runChecks() {
    console.log("Running notification checks...");
    let count = 0;

    // 0. Base Date Reference
    const now = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(now.getDate() + 3);

    // 1. Check Upcoming Events (Deadlines, Hearings, Meetings)
    // We look for events in the next 3 days that are not completed.
    const upcomingEvents = await prisma.event.findMany({
        where: {
            date: {
                gte: now,
                lte: threeDaysFromNow
            },
            status: { not: 'Completado' }
        },
        include: { case: true, client: true }
    });

    for (const event of upcomingEvents) {
        // Construct a unique key to prevent duplicate notifications for this specific event cycle
        // Current simple logic: check if unread notification exists for this event title

        let msg = `Tienes un evento pendiente: ${event.title}`;
        let link = '/agenda';
        let type: NotificationType = 'INFO';

        if (event.type === 'vencimiento') {
            msg = `VECIMIENTO PRÓXIMO: ${event.title}. Fecha: ${event.date.toLocaleDateString()}`;
            type = 'ALERT';
            if (event.caseId) link = `/expedientes/${event.caseId}`;
        } else if (event.type === 'audiencia') {
            msg = `AUDIENCIA PROGRAMADA: ${event.title}. Fecha: ${event.date.toLocaleDateString()}`;
            type = 'WARNING';
            if (event.caseId) link = `/expedientes/${event.caseId}`;
        } else if (event.type === 'pago_cuota') {
            msg = `PAGO PROGRAMADO: ${event.title}. Cliente: ${event.client?.name || 'N/A'}`;
            type = 'INFO';
            if (event.clientId) link = `/clientes/${event.clientId}`;
        }

        const exists = await prisma.notification.findFirst({
            where: {
                title: `Recordatorio: ${event.title}`,
                createdAt: {
                    gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()) // Created today
                }
            }
        });

        if (!exists) {
            await prisma.notification.create({
                data: {
                    type,
                    title: `Recordatorio: ${event.title}`,
                    message: msg,
                    link
                }
            });
            count++;
        }
    }

    // 2. Check Overdue Payments (Payment Plans)
    // This assumes events of type 'pago_cuota' are generated when a plan is created.
    // We check for events that are in the past and still 'Pendiente'.
    const overduePayments = await prisma.event.findMany({
        where: {
            type: 'pago_cuota',
            date: { lt: now }, // Past date
            status: 'Pendiente'
        },
        include: { client: true }
    });

    for (const paymentEvent of overduePayments) {
        // Check if we already notified about this overdue payment RECENTLY (e.g. in the last 24h)
        const exists = await prisma.notification.findFirst({
            where: {
                title: `PAGO ATRASADO: ${paymentEvent.title}`,
                createdAt: {
                    gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) // Last 24 hours
                }
            }
        });

        if (!exists) {
            await prisma.notification.create({
                data: {
                    type: 'ALERT',
                    title: `PAGO ATRASADO: ${paymentEvent.title}`,
                    message: `La cuota del cliente ${paymentEvent.client?.name} venció el ${paymentEvent.date.toLocaleDateString()}.`,
                    link: paymentEvent.clientId ? `/clientes/${paymentEvent.clientId}` : '/agenda'
                }
            });
            count++;
        }
    }

    if (count > 0) {
        revalidatePath("/");
    }

    return { created: count };
}
