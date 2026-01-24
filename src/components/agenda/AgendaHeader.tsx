"use client";

import { useState } from "react";
import { Plus, Trophy } from "lucide-react";
import AddReminderModal from "@/components/dashboard/AddReminderModal";

export default function AgendaHeader() {
    const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);

    return (
        <div className="flex justify-between items-center mb-6">
            <div>
                <h1 className="text-3xl font-bold text-white mb-1">Agenda Judicial</h1>
                <p className="text-gray-400">Organiza tus audiencias y vencimientos.</p>
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={() => setIsReminderModalOpen(true)}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    <Plus size={20} />
                    Nuevo Recordatorio
                </button>

                {/* XP Bar Widget */}
                <div className="glass-card px-4 py-2 flex items-center gap-3 border-lime-500/30 hidden md:flex">
                    <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-400">
                        <Trophy size={20} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 uppercase font-bold">Nivel 5</p>
                        <div className="w-32 h-2 bg-gray-800 rounded-full mt-1 overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-lime-500 to-emerald-500 w-[65%]"></div>
                        </div>
                    </div>
                </div>
            </div>

            <AddReminderModal
                isOpen={isReminderModalOpen}
                onClose={() => setIsReminderModalOpen(false)}
            />
        </div>
    );
}
