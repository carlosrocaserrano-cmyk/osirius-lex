"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { addXP } from "@/actions/gamification-actions";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function getClients() {
    return await prisma.client.findMany({
        orderBy: { name: 'asc' },
        select: { id: true, name: true, email: true, phone: true, identityDoc: true, address: true }
    });
}

export async function createCase(clientId: string, formData: FormData) {
    const caratula = formData.get("caratula") as string;
    const juzgado = formData.get("juzgado") as string;
    const ianus = formData.get("ianus") as string; // Will be empty if juridica
    const expediente = formData.get("expediente") as string;
    const tipo = formData.get("tipo") as string;
    const isJuridica = formData.get("isJuridica") === 'true';
    const tramiteNumber = formData.get("tramiteNumber") as string;

    if (!clientId || !caratula) {
        throw new Error("Missing required fields");
    }

    await prisma.case.create({
        data: {
            caratula,
            juzgado,
            ianus: isJuridica ? null : ianus,
            tramiteNumber: isJuridica ? tramiteNumber : null,
            isJuridica,
            expediente,
            tipo,
            clientId,
            estado: "En trámite"
        }
    });

    await addXP(150, "Nuevo Caso Iniciado");

    revalidatePath(`/clientes/${clientId}`);
}

export async function createPayment(clientId: string, formData: FormData) {
    const concept = formData.get("concept") as string;
    const amount = parseFloat(formData.get("amount") as string);
    const isExtra = formData.get("isExtra") === 'true';

    if (!clientId || !concept || isNaN(amount)) {
        throw new Error("Missing required fields");
    }

    await prisma.payment.create({
        data: {
            concept,
            amount,
            clientId,
            status: "Pagado",
            date: new Date(),
            isExtra
        }
    });

    await addXP(isExtra ? 30 : 50, "Pago Registrado");

    revalidatePath(`/clientes/${clientId}`);
}

export async function createDocument(clientId: string, formData: FormData) {
    const name = formData.get("name") as string;
    const type = formData.get("type") as string; // 'received' | 'returned'

    if (!clientId || !name || !type) {
        throw new Error("Missing required fields");
    }

    await prisma.document.create({
        data: {
            name,
            type,
            clientId,
            date: new Date()
        }
    });

    revalidatePath(`/clientes/${clientId}`);
}

export async function deleteCase(caseId: string, clientId: string) {
    if (!caseId || !clientId) throw new Error("Missing required fields");

    await prisma.case.delete({
        where: { id: caseId }
    });

    revalidatePath(`/clientes/${clientId}`);
}

export async function deletePayment(paymentId: string, clientId: string) {
    if (!paymentId || !clientId) throw new Error("Missing required fields");

    await prisma.payment.delete({
        where: { id: paymentId }
    });

    revalidatePath(`/clientes/${clientId}`);
}

export async function deleteDocument(documentId: string, clientId: string) {
    if (!documentId || !clientId) throw new Error("Missing required fields");

    await prisma.document.delete({
        where: { id: documentId }
    });

    revalidatePath(`/clientes/${clientId}`);
}

export async function createPaymentPlan(clientId: string, formData: FormData) {
    const concept = formData.get("concept") as string;
    const totalAmount = parseFloat(formData.get("totalAmount") as string);
    const installments = parseInt(formData.get("installments") as string);
    const frequency = formData.get("frequency") as string; // 'Monthly' or 'Weekly'
    const startDateStr = formData.get("startDate") as string;

    if (!clientId || !concept || !totalAmount || !installments || !startDateStr) {
        throw new Error("Missing required fields");
    }

    const startDate = new Date(startDateStr);

    // Create the Plan
    const plan = await prisma.paymentPlan.create({
        data: {
            clientId,
            concept,
            totalAmount,
            installments,
            frequency,
            startDate,
            status: 'Activo'
        }
    });

    // Generate Reminders (Events)
    const events = [];
    let currentDate = new Date(startDate);
    const amountPerQuota = totalAmount / installments;

    for (let i = 1; i <= installments; i++) {
        // Create a copy of the date to avoid reference issues
        const eventDate = new Date(currentDate);

        events.push({
            title: `Vencimiento Cuota ${i}/${installments}: ${concept}`,
            description: `Plan de Pago. Monto: $${amountPerQuota.toFixed(2)}`,
            date: eventDate,
            type: 'vencimiento',
            status: 'Pendiente',
            clientId,
            paymentPlanId: plan.id // Link event to plan
        });

        // Advance date
        if (frequency === 'Mensual') {
            currentDate.setMonth(currentDate.getMonth() + 1);
        } else if (frequency === 'Semanal') {
            currentDate.setDate(currentDate.getDate() + 7);
        }
    }

    await prisma.event.createMany({
        data: events
    });


    revalidatePath(`/clientes/${clientId}`);
    revalidatePath(`/agenda`);
    revalidatePath(`/`);
}

export async function updateClient(clientId: string, formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const status = formData.get("status") as string;

    // Extended fields
    const identityDoc = formData.get("identityDoc") as string;
    const address = formData.get("address") as string;
    const representative = formData.get("representative") as string;
    const metadata = formData.get("metadata") as string;
    const wantsInvoice = formData.get("wantsInvoice") === 'true';
    const totalAgreedFee = parseFloat(formData.get("totalAgreedFee") as string) || 0;

    const photo = formData.get('photo') as File;
    let photoUrl = undefined;

    if (photo && photo.size > 0) {
        try {
            const buffer = Buffer.from(await photo.arrayBuffer());
            const filename = `${Date.now()}-${photo.name.replace(/\s/g, '_')}`;
            const uploadDir = join(process.cwd(), 'public/uploads');
            await mkdir(uploadDir, { recursive: true });
            await writeFile(join(uploadDir, filename), buffer);
            photoUrl = `/uploads/${filename}`;
        } catch (error) {
            console.error("Error uploading photo:", error);
        }
    }

    if (!clientId || !name) {
        throw new Error("Missing required fields");
    }

    const updateData: any = {
        name,
        email,
        phone,
        status,
        identityDoc,
        address,
        representative,
        metadata,
        wantsInvoice,
        totalAgreedFee
    };

    if (photoUrl) {
        updateData.photoUrl = photoUrl;
    }

    await prisma.client.update({
        where: { id: clientId },
        data: updateData
    });

    revalidatePath(`/clientes/${clientId}`);
}

export async function deleteClient(clientId: string) {
    if (!clientId) throw new Error("Client ID is required");

    // Prisma Cascade Delete handles relations, but we can be explicit if needed.
    // Ensure user has permissions (if auth was fully implemented, for now check ID)

    await prisma.client.delete({
        where: { id: clientId }
    });

    revalidatePath("/");
    revalidatePath("/clientes");
}

export async function updateCase(caseId: string, clientId: string, formData: FormData) {
    const caratula = formData.get("caratula") as string;
    const juzgado = formData.get("juzgado") as string;
    const ianus = formData.get("ianus") as string;
    const expediente = formData.get("expediente") as string;
    const tipo = formData.get("tipo") as string;
    const estado = formData.get("estado") as string;

    if (!caseId || !caratula) {
        throw new Error("Missing required fields");
    }

    await prisma.case.update({
        where: { id: caseId },
        data: {
            caratula,
            juzgado,
            ianus,
            expediente,
            tipo,
            estado
        }
    });

    revalidatePath(`/clientes/${clientId}`);
}

export async function updateEventStatus(eventId: string, status: string) {
    if (!eventId || !status) throw new Error("Missing fields");

    const event = await prisma.event.update({
        where: { id: eventId },
        data: { status }
    });

    revalidatePath('/agenda');
    revalidatePath('/'); // Dashboard
    revalidatePath(`/clientes/${event.clientId}`);
}

export async function updatePaymentPlan(planId: string, clientId: string, formData: FormData) {
    const concept = formData.get("concept") as string;
    const status = formData.get("status") as string;

    if (!planId || !concept || !status) {
        throw new Error("Missing required fields");
    }

    const previousPlan = await prisma.paymentPlan.findUnique({ where: { id: planId } });

    await prisma.paymentPlan.update({
        where: { id: planId },
        data: {
            concept,
            status
        }
    });

    // Smart Cancellation Logic
    if (status === 'Cancelado' && previousPlan?.status !== 'Cancelado') {
        // Delete future pending events linked to this plan
        await prisma.event.deleteMany({
            where: {
                paymentPlanId: planId, // Robust linking
                status: 'Pendiente',
                date: {
                    gte: new Date() // Only future ones
                }
            }
        });
    }

    revalidatePath(`/clientes/${clientId}`);
}

export async function createClient(formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    // New Fields
    const identityDoc = formData.get("identityDoc") as string;
    const address = formData.get("address") as string;
    const representative = formData.get("representative") as string;
    const wantsInvoice = formData.get("wantsInvoice") === 'true';
    const metadata = formData.get("metadata") as string;

    const photo = formData.get('photo') as File;
    let photoUrl = null;

    if (photo && photo.size > 0) {
        try {
            const buffer = Buffer.from(await photo.arrayBuffer());
            const filename = `${Date.now()}-${photo.name.replace(/\s/g, '_')}`;
            const uploadDir = join(process.cwd(), 'public/uploads');
            await mkdir(uploadDir, { recursive: true });
            await writeFile(join(uploadDir, filename), buffer);
            photoUrl = `/uploads/${filename}`;
        } catch (error) {
            console.error("Error uploading photo:", error);
        }
    }

    if (!name) {
        throw new Error("Missing required fields");
    }

    const client = await prisma.client.create({
        data: {
            name,
            email,
            phone,
            identityDoc,
            address,
            representative,
            status: 'Activo',
            wantsInvoice,
            metadata,
            photoUrl
        }
    });

    await addXP(100, "Nuevo Cliente");

    // Automated Contract Generation
    // We pass the new fields to the logic (simulated here since we lack a Blob store)
    // In a real scenario:
    // const pdfBlob = generateIgualaContract({
    //    clientName: name,
    //    clientDoc: identityDoc,
    //    clientAddress: address,
    //    clientRep: representative,
    //    startDate: new Date(),
    //    amount: 18000 // Default or from form
    // });

    await prisma.document.create({
        data: {
            clientId: client.id,
            name: "Contrato de Iguala Profesional (Generado)",
            type: "received", // Or 'generated' if we add that enum
            date: new Date()
        }
    });

    revalidatePath("/clientes");
}



export async function createMeetingSummary(caseId: string, clientId: string, content: string) {
    if (!caseId || !content) throw new Error("Missing fields");

    await prisma.meetingSummary.create({
        data: {
            caseId,
            content,
            date: new Date()
        }
    });

    revalidatePath(`/clientes/${clientId}`);
}

export async function deleteMeetingSummary(summaryId: string, clientId: string) {
    if (!summaryId) throw new Error("Missing summary ID");

    await prisma.meetingSummary.delete({
        where: { id: summaryId }
    });

    revalidatePath(`/clientes/${clientId}`);
}
