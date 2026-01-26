"use client";

import { getEvents } from "@/actions/agenda-actions";
import { updateEventStatus } from "@/actions/client-actions";
import { AlertTriangle, ChevronLeft, ChevronRight, Clock, FileText, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { AddEventModal } from "./AddEventModal";

const EVENT_STYLES = {
    audiencia: "bg-rose-500/20 text-rose-400 border-rose-500/30",
    vencimiento: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    tramite: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    reunion: "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

export function CalendarGrid() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [filterType, setFilterType] = useState<string | null>(null);

    const handleToggleStatus = async (e: React.MouseEvent, event: any) => {
        e.stopPropagation();
        const newStatus = event.status === 'Completado' ? 'Pendiente' : 'Completado';

        // Optimistic update
        setEvents(events.map(ev => ev.id === event.id ? { ...ev, status: newStatus } : ev));

        try {
            await updateEventStatus(event.id, newStatus);
        } catch (error) {
            console.error("Failed to update status", error);
            // Revert
            setEvents(events.map(ev => ev.id === event.id ? { ...ev, status: event.status } : ev));
        }
    };

    const openModal = (day: number) => {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        setSelectedDate(date);
        setIsModalOpen(true);
    };

    useEffect(() => {
        const fetchEvents = async () => {
            const start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            const end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
            const data = await getEvents(start, end);
            setEvents(data);
        };
        fetchEvents();
    }, [currentDate]);

    const changeMonth = (delta: number) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + delta);
        setCurrentDate(newDate);
    };

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const startDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(); // 0 is Sunday

    // Generate days array with padding
    const days = Array.from({ length: 35 }, (_, i) => {
        const dayNum = i - startDay + 1;
        if (dayNum > 0 && dayNum <= daysInMonth) return dayNum;
        return null;
    });

    const monthName = currentDate.toLocaleString('es-ES', { month: 'long' });
    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    {capitalize(monthName)} {currentDate.getFullYear()}
                </h2>
                <div className="flex gap-2">
                    <button onClick={() => changeMonth(-1)} className="p-2 glass-card hover:bg-gray-800 transition-colors rounded-lg">
                        <ChevronLeft size={20} />
                    </button>
                    <button onClick={() => changeMonth(1)} className="p-2 glass-card hover:bg-gray-800 transition-colors rounded-lg">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                <button
                    onClick={() => setFilterType(null)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors border ${!filterType ? 'bg-white text-black border-white' : 'bg-transparent text-gray-400 border-gray-700 hover:border-gray-500'}`}
                >
                    Todos
                </button>
                {['audiencia', 'vencimiento', 'tramite', 'reunion'].map(type => (
                    <button
                        key={type}
                        onClick={() => setFilterType(type)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase transition-colors border ${filterType === type ? EVENT_STYLES[type as keyof typeof EVENT_STYLES].replace('bg-', 'bg-opacity-100 bg-').replace('text-', 'text-black text-').replace('border-', 'border-transparent border-') : 'bg-transparent text-gray-500 border-gray-700 hover:border-gray-500'}`}
                    >
                        {type}
                    </button>
                ))}
            </div>

            {/* Week Days Header */}
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => (
                    <div key={d} className="text-sm font-bold text-gray-500 uppercase tracking-wider py-2">
                        {d}
                    </div>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7 gap-2">
                {days.map((day, idx) => {
                    // Filter events for this specific day
                    const eventsToday = events.filter(e => {
                        const eDate = new Date(e.date);
                        const matchesDay = day && eDate.getDate() === day &&
                            eDate.getMonth() === currentDate.getMonth() &&
                            eDate.getFullYear() === currentDate.getFullYear();

                        if (!matchesDay) return false;
                        if (filterType && e.type !== filterType) return false;
                        return true;
                    });

                    const isToday = day === new Date().getDate() &&
                        currentDate.getMonth() === new Date().getMonth() &&
                        currentDate.getFullYear() === new Date().getFullYear();

                    return (
                        <div
                            key={idx}
                            className={`
                 min-h-[120px] p-2 rounded-xl border transition-all relative group
                 ${day ? 'bg-[#1a1a20]/50 border-gray-800 hover:border-lime-500/30 cursor-pointer' : 'bg-transparent border-transparent'}
                 ${isToday && day ? 'ring-1 ring-lime-500 bg-lime-500/5' : ''}
               `}
                        >
                            {day && (
                                <>
                                    <span className={`
                     text-sm font-bold block mb-2
                     ${isToday ? 'text-lime-400' : 'text-gray-400'}
                   `}>
                                        {day}
                                    </span>

                                    <div className="space-y-1">
                                        {eventsToday.map(ev => (
                                            <div
                                                key={ev.id}
                                                onClick={(e) => handleToggleStatus(e, ev)}
                                                className={`
                                                  text-[10px] px-2 py-1 rounded border mb-1 truncate flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity
                                                  ${EVENT_STYLES[ev.type as keyof typeof EVENT_STYLES] || 'text-gray-400 border-gray-600'}
                                                  ${ev.status === 'Completado' ? 'opacity-50 grayscale decoration-slice' : ''}
                                                `}
                                                title={`${ev.time} - ${ev.title} (${ev.status})`}
                                            >
                                                {ev.status === 'Completado' && <CheckCircle2 size={10} />}
                                                <span className={`font-bold ${ev.status === 'Completado' ? 'line-through' : ''}`}>
                                                    {new Date(ev.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                <span className={`truncate ${ev.status === 'Completado' ? 'line-through' : ''}`}>{ev.title}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Add button on hover */}
                                    <button
                                        onClick={(e) => { e.stopPropagation(); openModal(day); }}
                                        className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-lime-500 text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                                    >
                                        +
                                    </button>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>

            <AddEventModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                defaultDate={selectedDate}
            />
        </div>
    );
}
