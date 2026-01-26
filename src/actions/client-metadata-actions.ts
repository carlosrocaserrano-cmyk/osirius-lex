"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateClientMetadata(clientId: string, metadata: string) {
    if (!clientId) throw new Error("Missing client ID");

    await prisma.client.update({
        where: { id: clientId },
        data: {
            metadata
        }
    });

    revalidatePath(`/clientes/${clientId}`);
}
