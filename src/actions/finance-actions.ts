"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { addXP } from "@/actions/gamification-actions";

export async function getFinancialStats() {
    // 1. Get total Income (Payments)
    const incomeAgg = await prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: 'Pagado' }
    });

    // 2. Get total Outcome (Expenses)
    const expenseAgg = await prisma.expense.aggregate({
        _sum: { amount: true }
    });

    // 3. Calculate Totals
    const totalIncome = incomeAgg._sum.amount || 0;
    const totalExpenses = expenseAgg._sum.amount || 0;
    const netProfit = totalIncome - totalExpenses;

    // 4. Tax Estimation (Simple Model for Bolivia)
    // IVA (13%) + IT (3%) = ~16% of Income
    const taxEstimate = totalIncome * 0.16;

    return {
        totalIncome,
        totalExpenses,
        netProfit,
        taxEstimate
    };
}

export async function getRecentTransactions() {
    // Combine Payments and Expenses into a single sorted list
    const payments = await prisma.payment.findMany({
        take: 20,
        orderBy: { date: 'desc' },
        include: { client: { select: { name: true } } }
    });

    const expenses = await prisma.expense.findMany({
        take: 20,
        orderBy: { date: 'desc' },
        include: { client: { select: { name: true } } }
    });

    // Normalize
    const normalizedPayments = payments.map(p => ({
        id: p.id,
        type: 'INCOME',
        concept: p.concept,
        amount: p.amount,
        date: p.date,
        entity: p.client?.name || 'Cliente',
        category: 'Honorarios'
    }));

    const normalizedExpenses = expenses.map(e => ({
        id: e.id,
        type: 'EXPENSE',
        concept: e.description,
        amount: e.amount,
        date: e.date,
        entity: e.client?.name || 'Oficina/Operativo',
        category: e.category
    }));

    // Merge and Sort
    const all = [...normalizedPayments, ...normalizedExpenses].sort((a, b) => b.date.getTime() - a.date.getTime());

    return all.slice(0, 30);
}

export async function createGlobalExpense(formData: FormData) {
    const description = formData.get("description") as string;
    const amount = parseFloat(formData.get("amount") as string);
    const category = formData.get("category") as string;
    const dateStr = formData.get("date") as string;

    if (!description || isNaN(amount)) {
        throw new Error("Missing fields");
    }

    await prisma.expense.create({
        data: {
            description,
            amount,
            category: category || "Operativo",
            date: dateStr ? new Date(dateStr) : new Date(),
            isDeductible: true // Default
        }
    });

    await addXP(20, "Gasto Registrado");

    revalidatePath("/finanzas");
}

export async function createExpense(clientId: string, formData: FormData) {
    const description = formData.get("description") as string;
    const amount = parseFloat(formData.get("amount") as string);
    const category = formData.get("category") as string;
    const dateStr = formData.get("date") as string;
    const isDeductible = formData.get("isDeductible") === 'on';

    // Optional: Link to a Case
    const caseId = formData.get("caseId") as string;

    if (!clientId || !description || isNaN(amount)) {
        throw new Error("Missing fields");
    }

    await prisma.expense.create({
        data: {
            description,
            amount,
            category: category || "Operativo",
            date: dateStr ? new Date(dateStr) : new Date(),
            isDeductible,
            clientId,
            caseId: caseId || undefined
        }
    });

    await addXP(20, "Gasto Registrado");

    revalidatePath(`/clientes/${clientId}`);
    if (caseId) revalidatePath(`/expedientes/${caseId}`);
    revalidatePath("/finanzas");
}
