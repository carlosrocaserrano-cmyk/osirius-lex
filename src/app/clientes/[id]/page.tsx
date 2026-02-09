
import { prisma } from "@/lib/prisma";
import { ClientDetails } from "@/components/clients/ClientDetails";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function ClientPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const client = await prisma.client.findUnique({
        where: { id },
        include: {
            cases: {
                include: { summaries: { orderBy: { date: 'desc' } } }
            },
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
        metadata: client.metadata,
        photoUrl: client.photoUrl,
        identityDoc: client.identityDoc,
        address: client.address,
        representative: client.representative,
        wantsInvoice: client.wantsInvoice,
        totalAgreedFee: client.totalAgreedFee, // [NEW]
        cases: client.cases.map(c => ({
            id: c.id,
            ianus: c.ianus || '',
            expediente: c.expediente || '',
            caratula: c.caratula,
            juzgado: c.juzgado || '',
            tipo: c.tipo || '',
            estado: c.estado,
            isJuridica: c.isJuridica, // [NEW]
            tramiteNumber: c.tramiteNumber, // [NEW]
            summaries: c.summaries // [NEW]
        })),
        documents: {
            received: client.documents.filter(d => d.type === 'received').map(d => ({
                id: d.id,
                name: d.name,
                date: d.date.toISOString().split('T')[0],
                type: d.type
            })),
            returned: client.documents.filter(d => d.type === 'returned').map(d => ({
                id: d.id,
                name: d.name,
                date: d.date.toISOString().split('T')[0],
                type: d.type
            }))
        },
        payments: client.payments.map(p => ({
            id: p.id,
            concept: p.concept,
            amount: p.amount,
            date: p.date.toISOString().split('T')[0],
            status: p.status,
            isExtra: p.isExtra // [NEW]
        })),
        paymentPlans: client.paymentPlans.map(pp => ({
            id: pp.id,
            concept: pp.concept,
            totalAmount: pp.totalAmount,
            installments: pp.installments,
            frequency: pp.frequency,
            status: pp.status,
            startDate: pp.startDate.toISOString().split('T')[0]
        })),
        expenses: client.expenses?.map(e => ({
            id: e.id,
            description: e.description,
            amount: e.amount,
            category: e.category,
            date: e.date.toISOString().split('T')[0],
            case: e.case ? { caratula: e.case.caratula, expediente: e.case.expediente } : null
        })) || []
    };

    return <ClientDetails client={uiClient} templates={templates} />;
}
