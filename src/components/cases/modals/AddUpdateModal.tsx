"use client";

import { Modal } from "@/components/ui/Modal";
import { addCaseUpdate } from "@/actions/case-actions";
import { useState } from "react";
import { FileText, Calendar, MessageSquare, StickyNote } from "lucide-react";

interface AddUpdateModalProps {
    isOpen: boolean;
    onClose: () => void;
    caseId: string;
}

export function AddUpdateModal({ isOpen, onClose, caseId }: AddUpdateModalProps) {
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        try {
            await addCaseUpdate(caseId, formData);
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Registrar Gestión o Movimiento">
            <form action={handleSubmit} className="space-y-4">

                {/* Fecha */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Fecha del Movimiento</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-2.5 text-gray-500" size={18} />
                        <input type="date" name="date" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full bg-[#25252d] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-lime-500 transition-colors" />
                    </div>
                </div>

                {/* Título */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Título de la Gestión</label>
                    <div className="relative">
                        <FileText className="absolute left-3 top-2.5 text-gray-500" size={18} />
                        <input name="title" required placeholder="Ej: Presentación de Escrito Solicitando..." className="w-full bg-[#25252d] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-lime-500 transition-colors" />
                    </div>
                </div>

                {/* Descripción */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Detalle / Descripción</label>
                    <div className="relative">
                        <StickyNote className="absolute left-3 top-3 text-gray-500" size={18} />
                        <textarea name="description" rows={3} required placeholder="Describir lo realizado..." className="w-full bg-[#25252d] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-lime-500 transition-colors" />
                    </div>
                </div>

                {/* Respuesta */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Respuesta del Juzgado / Institución (Opcional)</label>
                    <div className="relative">
                        <MessageSquare className="absolute left-3 top-2.5 text-gray-500" size={18} />
                        <input name="response" placeholder="Ej: Proveyeron a fs. 10..." className="w-full bg-[#25252d] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-lime-500 transition-colors" />
                    </div>
                </div>

                <button disabled={isLoading} type="submit" className="w-full mt-6 bg-lime-500 hover:bg-lime-400 text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50">
                    {isLoading ? "Guardando..." : "Registrar en Historial"}
                </button>
            </form>
        </Modal>
    );
}
