"use client";

import { Modal } from "@/components/ui/Modal";
import { createPaymentPlan } from "@/actions/client-actions";
import { useState } from "react";
import { FileText, DollarSign, Calendar, RefreshCw } from "lucide-react";

interface AddPaymentPlanModalProps {
    isOpen: boolean;
    onClose: () => void;
    clientId: string;
}

export function AddPaymentPlanModal({ isOpen, onClose, clientId }: AddPaymentPlanModalProps) {
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        try {
            await createPaymentPlan(clientId, formData);
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Nuevo Plan de Pagos">
            <form action={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Concepto del Plan</label>
                    <div className="relative">
                        <FileText className="absolute left-3 top-2.5 text-gray-500" size={18} />
                        <input name="concept" required placeholder="Ej: Honorarios Diversio y Alimentos" className="w-full bg-[#25252d] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-lime-500 transition-colors" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Monto Total</label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-2.5 text-gray-500" size={18} />
                            <input type="number" step="0.01" name="totalAmount" required placeholder="0.00" className="w-full bg-[#25252d] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-lime-500 transition-colors" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Cant. Cuotas</label>
                        <div className="relative">
                            <RefreshCw className="absolute left-3 top-2.5 text-gray-500" size={18} />
                            <input type="number" min="2" max="24" name="installments" required placeholder="6" className="w-full bg-[#25252d] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-lime-500 transition-colors" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Frecuencia</label>
                        <select name="frequency" className="w-full bg-[#25252d] border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-lime-500 transition-colors appearance-none">
                            <option value="Mensual">Mensual</option>
                            <option value="Semanal">Semanal</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">1er Vencimiento</label>
                        <div className="relative">
                            <input type="date" name="startDate" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full bg-[#25252d] border border-gray-700 rounded-lg py-2 pl-3 pr-4 text-white focus:outline-none focus:border-lime-500 transition-colors" />
                        </div>
                    </div>
                </div>

                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-sm text-blue-200">
                    <p className="flex items-start gap-2">
                        <span className="text-xl">💡</span>
                        <span>Se crearán automáticamente los eventos en la Agenda y Dashboard para cada vencimiento.</span>
                    </p>
                </div>

                <button disabled={isLoading} type="submit" className="w-full mt-6 bg-lime-500 hover:bg-lime-400 text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50">
                    {isLoading ? "Procesando..." : "Crear Plan"}
                </button>
            </form>
        </Modal>
    );
}
