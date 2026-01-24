"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const SETTINGS_ID = "user_settings";

export async function getSettings() {
    let settings = await prisma.userSettings.findUnique({
        where: { id: SETTINGS_ID }
    });

    if (!settings) {
        settings = await prisma.userSettings.create({
            data: { id: SETTINGS_ID }
        });
    }

    return settings;
}

export async function updateSettings(formData: FormData) {
    const name = formData.get("name") as string;
    const firmName = formData.get("firmName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const address = formData.get("address") as string;

    await prisma.userSettings.upsert({
        where: { id: SETTINGS_ID },
        update: {
            name,
            firmName,
            email,
            phone,
            address
        },
        create: {
            id: SETTINGS_ID,
            name,
            firmName,
            email,
            phone,
            address
        }
    });

    revalidatePath("/settings");
    revalidatePath("/"); // Update greeting in dashboard
}
