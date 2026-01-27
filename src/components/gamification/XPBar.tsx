"use client";

import { useEffect, useState } from "react";
import { getGamificationProfile } from "@/actions/gamification-actions";
import { Trophy, Star } from "lucide-react";
import { getLevelTitle } from "@/lib/gamification/levels";

export default function XPBar() {
    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
        getGamificationProfile()
            .then(setProfile)
            .catch(err => console.error("XPBar error:", err));
    }, []);

    if (!profile) return (
        <div className="mt-4 p-4 border-t border-gray-800 animate-pulse">
            <div className="h-4 bg-gray-800 rounded w-3/4 mb-2"></div>
            <div className="h-2 bg-gray-800 rounded w-full"></div>
        </div>
    );

    const levelTitle = getLevelTitle(profile.currentLevel);

    return (
        <div className="mt-4 p-4 border-t border-gray-800">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <div className="p-1 bg-yellow-500/20 rounded text-yellow-500">
                        <Trophy size={14} />
                    </div>
                    <div>
                        <div className="text-xs font-bold text-white">Nivel {profile.currentLevel}</div>
                        <div className="text-[10px] text-gray-500">{levelTitle}</div>
                    </div>
                </div>
                <div className="text-[10px] text-gray-400 font-mono">
                    {profile.totalXP} XP
                </div>
            </div>

            <div className="relative w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-600 to-yellow-400 transition-all duration-1000"
                    style={{ width: `${profile.progress}%` }}
                />
            </div>
            <div className="text-right mt-1 text-[9px] text-gray-600">
                Siguiente nivel: {profile.nextLevelXP} XP
            </div>
        </div>
    );
}
