"use client";

import { Modal } from "@/components/ui/Modal";
import { createExpense } from "@/actions/finance-actions";
import { useState } from "react";
import { DollarSign, FileText, Tag, Briefcase } from "lucide-react";

interface AddClientExpenseModalProps {
    isOpen: boolean;
    onClose: () => void;
    clientId: string;
    cases?: { id: string; caratula: string }[];
}

export function AddClientExpenseModal({ isOpen, onClose, clientId, cases = [] }: AddClientExpenseModalProps) {
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        try {
            await createExpense(clientId, formData);
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Registrar Gasto a Cliente">
            <form action={handleSubmit} className="space-y-4">
                <input type="hidden" name="clientId" value={clientId} />

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Concepto / Descripción</label>
                    <div className="relative">
                        <FileText className="absolute left-3 top-2.5 text-gray-500" size={18} />
                        <input
                            name="description"
                            required
                            placeholder="Ej. Fotocopias, Timbres, Viáticos..."
                            className="w-full bg-[#25252d] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-lime-500 transition-colors"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Monto (Gasto)</label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-2.5 text-gray-500" size={18} />
                            <input
                                name="amount"
                                type="number"
                                step="0.01"
                                required
                                placeholder="0.00"
                                className="w-full bg-[#25252d] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-lime-500 transition-colors"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Categoría</label>
                        <div className="relative">
                            <Tag className="absolute left-3 top-2.5 text-gray-500" size={18} />
                            <select
                                name="category"
                                className="w-full bg-[#25252d] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-lime-500 transition-colors appearance-none"
                            >
                                <option value="Operativo">Operativo</option>
                                <option value="Judicial">Judicial</option>
                                <option value="Administrativo">Administrativo</option>
                                <option value="Variable">Variable</option>
                            </select>
                        </div>
                    </div>
                </div>

                {cases.length > 0 && (
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Vincular a Expediente (Opcional)</label>
                        <div className="relative">
                            <Briefcase className="absolute left-3 top-2.5 text-gray-500" size={18} />
                            <select
                                name="caseId"
                                className="w-full bg-[#25252d] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-lime-500 transition-colors appearance-none"
                            >
                                <option value="">-- General / Sin Expediente --</option>
                                {cases.map(c => (
                                    <option key={c.id} value={c.id}>{c.caratula}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-2 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                    <input type="checkbox" id="deductible" name="isDeductible" className="w-4 h-4 rounded border-gray-600 text-lime-500 focus:ring-lime-500 bg-gray-700" />
                    <label htmlFor="deductible" className="text-sm text-gray-300">Es deducible de impuestos (Crédito Fiscal)</label>
                </div>

                <div className="pt-2">
                    <button disabled={isLoading} type="submit" className="w-full bg-red-500 hover:bg-red-400 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-red-500/20">
                        {isLoading ? "Registrando..." : "Registrar Gasto"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
