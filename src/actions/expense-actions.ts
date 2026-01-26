'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addExpense(clientId: string, description: string, amount: number, date: Date) {
    if (!clientId || !description || !amount) {
        throw new Error("Missing required fields");
    }

    await prisma.expense.create({
        data: {
            clientId,
            description,
            amount,
            date,
            category: "Operativo", // Default for now
            isDeductible: true // Default
        }
    });

    revalidatePath(`/clientes/${clientId}`);
}

export async function deleteExpense(id: string) {
    if (!id) throw new Error("Missing ID");

    const expense = await prisma.expense.delete({
        where: { id }
    });

    if (expense.clientId) {
        revalidatePath(`/clientes/${expense.clientId}`);
    }
}

export async function getExpenses(clientId: string) {
    if (!clientId) return [];

    return await prisma.expense.findMany({
        where: { clientId },
        orderBy: { date: 'desc' }
    });
}
