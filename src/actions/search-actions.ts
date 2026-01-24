"use server";

import { prisma } from "@/lib/prisma";

export async function globalSearch(query: string) {
    if (!query || query.length < 2) return { clients: [], cases: [] };

    const clients = await prisma.client.findMany({
        where: {
            OR: [
                { name: { contains: query } }, // Case insensitive usually handled by DB collation or provider
                { identityDoc: { contains: query } },
                { email: { contains: query } }
            ]
        },
        take: 5,
        select: { id: true, name: true, identityDoc: true }
    });

    const cases = await prisma.case.findMany({
        where: {
            OR: [
                { caratula: { contains: query } },
                { expediente: { contains: query } },
                { ianus: { contains: query } }
            ]
        },
        take: 5,
        include: { client: { select: { name: true } } }
    });

    return { clients, cases };
}
