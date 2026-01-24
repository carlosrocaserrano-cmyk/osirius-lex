
import { prisma } from "@/lib/prisma";
import { ClientDetails } from "@/components/clients/ClientDetails";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function ClientPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const client = await prisma.client.findUnique({
        where: { id },
        include: {
            cases: true,
            payments: true,
            documents: true,
            paymentPlans: true,
            expenses: {
                include: { case: true },
                orderBy: { date: 'desc' }
            }
        }
    });

    const templates = await prisma.template.findMany({
        orderBy: { name: 'asc' }
    });

    if (!client) {
        return notFound();
    }

    // Transform data for UI
    const uiClient = {
        id: client.id,
        name: client.name,
        email: client.email || "",
        phone: client.phone || "",
        status: client.status,
        metadata: client.metadata, // Important for the dynamic fields
        identityDoc: client.identityDoc, // Important for profile
        address: client.address,     // Important for profile
        representative: client.representative, // Important for profile
        wantsInvoice: client.wantsInvoice,
        cases: client.cases.map(c => ({
            id: c.id,
            ianus: c.ianus || '',
            expediente: c.expediente || '',
            caratula: c.caratula,
            juzgado: c.juzgado || '',
            tipo: c.tipo || '',
            estado: c.estado
        })),
        documents: {
            received: client.documents.filter(d => d.type === 'received').map(d => ({
                id: d.id,
                name: d.name,
                date: d.date.toLocaleDateString(),
                type: d.type
            })),
            returned: client.documents.filter(d => d.type === 'returned').map(d => ({
                id: d.id,
                name: d.name,
                date: d.date.toLocaleDateString(),
                type: d.type
            }))
        },
        payments: client.payments.map(p => ({
            id: p.id,
            concept: p.concept,
            amount: p.amount,
            date: p.date.toLocaleDateString(),
            status: p.status
        })),
        paymentPlans: client.paymentPlans.map(pp => ({
            id: pp.id,
            concept: pp.concept,
            totalAmount: pp.totalAmount,
            installments: pp.installments,
            frequency: pp.frequency,
            status: pp.status,
            startDate: pp.startDate.toLocaleDateString()
        })),
        expenses: client.expenses?.map(e => ({
            id: e.id,
            description: e.description,
            amount: e.amount,
            category: e.category,
            date: e.date.toLocaleDateString(),
            case: e.case ? { caratula: e.case.caratula, expediente: e.case.expediente } : null
        })) || []
    };

    return <ClientDetails client={uiClient} templates={templates} />;
}
