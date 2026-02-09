"use client";

import { Modal } from "@/components/ui/Modal";
import { createMeetingSummary } from "@/actions/client-actions";
import { useState } from "react";

interface AddSummaryModalProps {
    isOpen: boolean;
    onClose: () => void;
    clientId: string;
    caseId: string;
}

export function AddSummaryModal({ isOpen, onClose, clientId, caseId }: AddSummaryModalProps) {
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await createMeetingSummary(caseId, clientId, content);
            setContent("");
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Agregar Resumen de Reunión">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Detalles de la Reunión</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Escribe los puntos clave, acuerdos y tareas pendientes de la reunión..."
                        className="w-full h-40 bg-[#25252d] border border-gray-700 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-lime-500 transition-colors resize-none"
                        required
                    />
                </div>
                <button
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full bg-lime-500 hover:bg-lime-400 text-black font-bold py-3 rounded-xl shadow-lg shadow-lime-500/20 transition-all disabled:opacity-50"
                >
                    {isSubmitting ? "Guardando..." : "Guardar Resumen"}
                </button>
            </form>
        </Modal>
    );
}
