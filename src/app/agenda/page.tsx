


import { CalendarGrid } from "@/components/agenda/CalendarGrid";
import { AlertTriangle, Trophy } from "lucide-react";
import { getUpcomingUrgentEvents } from "@/actions/agenda-actions";
import AgendaHeader from "@/components/agenda/AgendaHeader";
import { runChecks } from "@/actions/notification-actions";

export default async function AgendaPage() {
    // Run checks when loading the agenda
    await runChecks();

    const urgentEvents = await getUpcomingUrgentEvents();

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
            {/* Main Calendar Area */}
            <div className="lg:col-span-3">
                <AgendaHeader />

                <CalendarGrid />
            </div>

            {/* Sidebar: Urgent Deadlines */}
            <div className="glass-card p-6 h-fit sticky top-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 text-rose-400">
                    <AlertTriangle size={20} />
                    Urgente (Próx. 3 días)
                </h3>
                <div className="space-y-4">
                    {urgentEvents.map((event: any) => (
                        <div key={event.id} className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20">
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-xs font-bold text-rose-400 px-2 py-0.5 bg-rose-500/10 rounded uppercase">
                                    {event.type}
                                </span>
                                <span className="text-gray-400 text-xs">
                                    {new Date(event.date).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-white font-medium text-sm mt-1">{event.title}</p>
                            {event.case && <p className="text-gray-500 text-xs mt-1">{event.case.caratula}</p>}
                        </div>
                    ))}
                    {urgentEvents.length === 0 && (
                        <p className="text-gray-500 text-sm">No hay urgencias próximas. ¡Bien hecho!</p>
                    )}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-800">
                    <h3 className="text-lg font-bold text-white mb-4">Metas Diarias</h3>
                    <div className="space-y-2">
                        <label className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded cursor-pointer group">
                            <input type="checkbox" className="w-5 h-5 rounded border-gray-600 text-lime-500 focus:ring-lime-500/50 bg-[#1a1a20]" />
                            <span className="text-gray-400 group-hover:text-white transition-colors text-sm">Revisar correos del juzgado</span>
                        </label>
                        <label className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded cursor-pointer group">
                            <input type="checkbox" className="w-5 h-5 rounded border-gray-600 text-lime-500 focus:ring-lime-500/50 bg-[#1a1a20]" />
                            <span className="text-gray-400 group-hover:text-white transition-colors text-sm">Llamar al cliente Perez</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}
