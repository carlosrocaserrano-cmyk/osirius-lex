"use client";

import { useState } from "react";
import { createGlobalExpense } from "@/actions/finance-actions";
import { DollarSign, Receipt, PlusCircle } from "lucide-react";

export function ExpensesWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        try {
            await createGlobalExpense(formData);
            setIsOpen(false);
            // Optional: Toast success
        } catch (e) {
            console.error(e);
        } finally {
            setIsSubmitting(false);
        }
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="w-full h-full glass-card p-4 flex flex-col items-center justify-center gap-2 hover:bg-white/5 transition-colors group cursor-pointer border border-dashed border-gray-700 hover:border-lime-500"
            >
                <div className="p-3 rounded-full bg-red-500/10 group-hover:bg-red-500/20 text-red-500 transition-colors">
                    <Receipt size={24} />
                </div>
                <span className="text-gray-400 group-hover:text-white font-medium">Registrar Gasto</span>
            </button>
        );
    }

    return (
        <div className="glass-card p-4 border-l-4 border-l-red-500">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Receipt className="text-red-500" size={16} />
                Nuevo Gasto (Caja Chica)
            </h3>
            <form action={handleSubmit} className="space-y-3">
                <input
                    name="description"
                    placeholder="Descripción (ej. Taxis)"
                    required
                    className="w-full bg-[#1a1a20] border border-gray-700 rounded p-2 text-sm text-white focus:border-red-500 outline-none"
                    autoFocus
                />
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <DollarSign className="absolute left-2 top-2 text-gray-500" size={14} />
                        <input
                            name="amount"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            required
                            className="w-full bg-[#1a1a20] border border-gray-700 rounded p-2 pl-7 text-sm text-white focus:border-red-500 outline-none"
                        />
                    </div>
                    <select name="category" className="bg-[#1a1a20] border border-gray-700 rounded p-2 text-sm text-gray-400 outline-none">
                        <option value="Operativo">Operativo</option>
                        <option value="Fijo">Fijo</option>
                        <option value="Variable">Variable</option>
                    </select>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="isDeductible" className="rounded border-gray-700 bg-gray-800" defaultChecked />
                    <span className="text-xs text-gray-400">¿Es deducible para impuestos?</span>
                </label>

                <div className="flex gap-2 pt-1">
                    <button type="button" onClick={() => setIsOpen(false)} className="flex-1 py-1.5 text-xs text-gray-400 hover:text-white">
                        Cancelar
                    </button>
                    <button disabled={isSubmitting} type="submit" className="flex-1 py-1.5 bg-red-500 hover:bg-red-400 text-white text-xs font-bold rounded transition-colors">
                        {isSubmitting ? "..." : "Registrar"}
                    </button>
                </div>
            </form>
        </div>
    );
}
