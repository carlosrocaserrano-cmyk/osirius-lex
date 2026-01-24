"use client";

import { Modal } from "@/components/ui/Modal";
import { createEvent } from "@/actions/agenda-actions";
import { useState } from "react";
import { FileText, Clock, AlertCircle } from "lucide-react";

interface AddEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultDate?: Date;
}

export function AddEventModal({ isOpen, onClose, defaultDate }: AddEventModalProps) {
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        try {
            await createEvent(formData);
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    const defaultDateStr = defaultDate ? defaultDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Nuevo Evento de Agenda">
            <form action={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Título</label>
                    <div className="relative">
                        <FileText className="absolute left-3 top-2.5 text-gray-500" size={18} />
                        <input name="title" required placeholder="Ej: Audiencia Preliminar" className="w-full bg-[#25252d] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-lime-500 transition-colors" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Fecha</label>
                        <div className="relative">
                            <input type="date" name="date" required defaultValue={defaultDateStr} className="w-full bg-[#25252d] border border-gray-700 rounded-lg py-2 pl-3 pr-4 text-white focus:outline-none focus:border-lime-500 transition-colors" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Hora</label>
                        <div className="relative">
                            <Clock className="absolute left-3 top-2.5 text-gray-500" size={18} />
                            <input type="time" name="time" required className="w-full bg-[#25252d] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-lime-500 transition-colors" />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Tipo de Evento</label>
                    <div className="relative">
                        <AlertCircle className="absolute left-3 top-2.5 text-gray-500" size={18} />
                        <select name="type" className="w-full bg-[#25252d] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-lime-500 transition-colors appearance-none">
                            <option value="audiencia">🔴 Audiencia</option>
                            <option value="vencimiento">🟡 Vencimiento de Plazo</option>
                            <option value="tramite">🟢 Trámite / Escrito</option>
                            <option value="reunion">🔵 Reunión</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Descripción (Opcional)</label>
                    <textarea name="description" rows={3} className="w-full bg-[#25252d] border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-lime-500 transition-colors" placeholder="Detalles adicionales..." />
                </div>

                <button disabled={isLoading} type="submit" className="w-full mt-6 bg-lime-500 hover:bg-lime-400 text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50">
                    {isLoading ? "Guardando..." : "Agendar Evento"}
                </button>
            </form>
        </Modal>
    );
}
