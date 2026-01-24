"use client";

import { Modal } from "@/components/ui/Modal";
import { updatePaymentPlan } from "@/actions/client-actions";
import { useState } from "react";
import { FileText, Activity, AlertTriangle } from "lucide-react";

interface EditPaymentPlanModalProps {
    isOpen: boolean;
    onClose: () => void;
    clientId: string;
    plan: {
        id: string;
        concept: string;
        status: string;
    };
}

export function EditPaymentPlanModal({ isOpen, onClose, clientId, plan }: EditPaymentPlanModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState(plan.status);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        try {
            await updatePaymentPlan(plan.id, clientId, formData);
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Editar Plan de Pago">
            <form action={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Concepto</label>
                    <div className="relative">
                        <FileText className="absolute left-3 top-2.5 text-gray-500" size={18} />
                        <input
                            name="concept"
                            defaultValue={plan.concept}
                            required
                            className="w-full bg-[#25252d] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-lime-500 transition-colors"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Estado</label>
                    <div className="relative">
                        <Activity className="absolute left-3 top-2.5 text-gray-500" size={18} />
                        <select
                            name="status"
                            defaultValue={plan.status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full bg-[#25252d] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-lime-500 transition-colors appearance-none"
                        >
                            <option value="Activo">Activo</option>
                            <option value="Completado">Completado</option>
                            <option value="Cancelado">Cancelado</option>
                        </select>
                    </div>
                </div>

                {status === 'Cancelado' && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex gap-3 items-start">
                        <AlertTriangle className="text-red-400 shrink-0 mt-0.5" size={18} />
                        <p className="text-xs text-red-300">
                            Advertencia: Al cancelar el plan, se eliminarán automáticamente todos los vencimientos futuros pendientes asociados a este plan en la Agenda.
                        </p>
                    </div>
                )}

                <button disabled={isLoading} type="submit" className="w-full mt-6 bg-lime-500 hover:bg-lime-400 text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50">
                    {isLoading ? "Guardando..." : "Guardar Cambios"}
                </button>
            </form>
        </Modal>
    );
}
