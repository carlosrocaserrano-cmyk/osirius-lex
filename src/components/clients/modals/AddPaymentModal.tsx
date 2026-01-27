"use client";

import { Modal } from "@/components/ui/Modal";
import { createPayment } from "@/actions/client-actions";
import { useState } from "react";
import { DollarSign, FileText } from "lucide-react";

interface AddPaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    clientId: string;
}

export function AddPaymentModal({ isOpen, onClose, clientId }: AddPaymentModalProps) {
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        try {
            await createPayment(clientId, formData);
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Registrar Nuevo Pago">
            <form action={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Concepto</label>
                    <div className="relative">
                        <FileText className="absolute left-3 top-2.5 text-gray-500" size={18} />
                        <input name="concept" required placeholder="Ej: Honorarios Marzo" className="w-full bg-[#25252d] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-lime-500 transition-colors" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Monto</label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-2.5 text-gray-500" size={18} />
                        <input name="amount" type="number" step="0.01" required placeholder="0.00" className="w-full bg-[#25252d] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-lime-500 transition-colors" />
                    </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-purple-500/10 rounded-lg border border-purple-500/30">
                    <input type="checkbox" id="isExtra" name="isExtra" value="true" className="w-4 h-4 rounded border-purple-500 bg-purple-900/50 text-purple-400" />
                    <label htmlFor="isExtra" className="text-sm text-purple-200 font-medium cursor-pointer">
                        ¿Es un pago por servicio EXTRA?
                        <span className="block text-xs text-purple-400/70 font-normal">No descontará del monto acordado global.</span>
                    </label>
                </div>

                <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-200 text-sm">
                    <p>ℹ️ Se generará automáticamente un recibo PDF provisional.</p>
                </div>

                <button disabled={isLoading} type="submit" className="w-full mt-6 bg-lime-500 hover:bg-lime-400 text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50">
                    {isLoading ? "Procesando..." : "Registrar Pago"}
                </button>
            </form>
        </Modal>
    );
}
