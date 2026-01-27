import { ClientList } from "@/components/clients/ClientList";
import { NewClientForm } from "@/components/clients/NewClientForm";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

async function getClients(query?: string) {
    const where = query
        ? {
            OR: [
                { name: { contains: query } }, // SQLite is case-insensitive by default for LIKE usually, but Prisma might need mode: 'insensitive' (Postgres) or just works.
                { email: { contains: query } }
            ]
        }
        : {};

    const clients = await prisma.client.findMany({
        where,
        include: { cases: true, payments: true },
        orderBy: { updatedAt: 'desc' }
    });

    return clients.map(c => ({
        id: c.id,
        name: c.name,
        email: c.email || '',
        phone: c.phone || '',
        status: c.status as any,
        debt: c.payments.reduce((acc, p) => p.status === 'Pendiente' ? acc + p.amount : acc, 0),
        caseCount: c.cases.length,
        lastActivity: c.updatedAt.toISOString().split('T')[0] // YYYY-MM-DD consistent format
    }));
}

export default async function ClientsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const resolvedParams = await searchParams;
    const query = resolvedParams?.q || "";
    const clients = await getClients(query);

    return (
        <ClientList initialClients={clients} />
    );
}
