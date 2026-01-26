"use client";

import { Modal } from "@/components/ui/Modal";
import { createDocument } from "@/actions/client-actions";
import { useState } from "react";
import { FileText, ArrowRightLeft } from "lucide-react";

interface AddDocumentModalProps {
    isOpen: boolean;
    onClose: () => void;
    clientId: string;
    defaultType?: 'received' | 'returned';
}

export function AddDocumentModal({ isOpen, onClose, clientId, defaultType = 'received' }: AddDocumentModalProps) {
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        try {
            await createDocument(clientId, formData);
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Registro Documental">
            <form action={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Nombre del Documento</label>
                    <div className="relative">
                        <FileText className="absolute left-3 top-2.5 text-gray-500" size={18} />
                        <input name="name" required placeholder="Ej: Escritura Original Propiedad X" className="w-full bg-[#25252d] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-lime-500 transition-colors" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Movimiento</label>
                    <div className="relative">
                        <ArrowRightLeft className="absolute left-3 top-2.5 text-gray-500" size={18} />
                        <select
                            name="type"
                            defaultValue={defaultType}
                            className="w-full bg-[#25252d] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-lime-500 transition-colors appearance-none"
                        >
                            <option value="received">📥 Recibido del Cliente</option>
                            <option value="returned">📤 Devuelto al Cliente</option>
                        </select>
                    </div>
                </div>

                <button disabled={isLoading} type="submit" className="w-full mt-6 bg-lime-500 hover:bg-lime-400 text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50">
                    {isLoading ? "Guardando..." : "Registrar Movimiento"}
                </button>
            </form>
        </Modal>
    );
}
