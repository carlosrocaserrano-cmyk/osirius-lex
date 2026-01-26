"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { calculateLevel, getXPForNextLevel } from "@/lib/gamification/levels";

const DEFAULT_USER_ID = "default-user";

export async function getGamificationProfile() {
    let profile = await prisma.gamificationProfile.findUnique({
        where: { userId: DEFAULT_USER_ID }
    });

    if (!profile) {
        profile = await prisma.gamificationProfile.create({
            data: { userId: DEFAULT_USER_ID }
        });
    }

    const nextLevelXP = getXPForNextLevel(profile.currentLevel);
    const progress = Math.min(100, (profile.totalXP / nextLevelXP) * 100);

    return {
        ...profile,
        nextLevelXP,
        progress,
        achievements: JSON.parse(profile.achievements)
    };
}

export async function addXP(amount: number, reason: string) {
    const profile = await getGamificationProfile();

    const newTotalXP = profile.totalXP + amount;
    const newLevel = calculateLevel(newTotalXP);

    await prisma.gamificationProfile.update({
        where: { userId: DEFAULT_USER_ID },
        data: {
            totalXP: newTotalXP,
            currentLevel: newLevel,
            lastAction: new Date()
        }
    });

    // Check for level up event (could return a flag to frontend)
    const leveledUp = newLevel > profile.currentLevel;

    revalidatePath("/");
    return { success: true, newLevel, leveledUp };
}
