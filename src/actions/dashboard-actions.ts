"use server";

import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
    const [clientCount, activeCaseCount, totalDebt, pendingEvents] = await Promise.all([
        prisma.client.count({ where: { status: 'Activo' } }),
        prisma.case.count({ where: { estado: 'En trámite' } }),
        prisma.payment.aggregate({
            _sum: { amount: true },
            where: { status: 'Pendiente' }
        }),
        prisma.event.count({
            where: {
                date: {
                    gte: new Date(),
                    lte: new Date(new Date().setDate(new Date().getDate() + 7))
                },
                status: 'Pendiente'
            }
        })
    ]);

    return {
        clients: clientCount,
        cases: activeCaseCount,
        debt: totalDebt._sum.amount || 0,
        urgentEvents: pendingEvents
    };
}

export async function getTodayEvents() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return await prisma.event.findMany({
        where: {
            date: {
                gte: today,
                lt: tomorrow
            }
        },
        orderBy: { date: 'asc' },
        include: { client: true, case: true }
    });
}
