"use client";

import { useState } from 'react';
import { X, DollarSign, Calendar } from 'lucide-react';
import { createGlobalExpense } from '@/actions/finance-actions';

interface AddGlobalExpenseModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddGlobalExpenseModal({ isOpen, onClose }: AddGlobalExpenseModalProps) {
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);

        try {
            await createGlobalExpense(formData);
            onClose();
        } catch (error) {
            console.error(error);
            alert("Error creating expense");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-[#1e293b] rounded-xl border border-gray-700 shadow-2xl w-full max-w-md overflow-hidden">
                <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-[#0f172a]">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                        <DollarSign className="text-red-500" size={20} />
                        Registrar Gasto Operativo
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="text-xs font-medium text-gray-400 mb-1 block">Descripción</label>
                        <input
                            name="description"
                            type="text"
                            required
                            placeholder="Ej: Alquiler Oficina Mes Enero"
                            className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-red-500 outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-medium text-gray-400 mb-1 block">Monto (Bs)</label>
                            <input
                                name="amount"
                                type="number"
                                step="0.01"
                                required
                                placeholder="0.00"
                                className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-red-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-400 mb-1 block">Categoría</label>
                            <select
                                name="category"
                                className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-red-500 outline-none"
                            >
                                <option value="Operativo">Operativo (Alquiler/Luz)</option>
                                <option value="Administrativo">Administrativo</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Transporte">Transporte</option>
                                <option value="Otros">Otros</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-medium text-gray-400 mb-1 block">Fecha</label>
                        <input
                            name="date"
                            type="date"
                            defaultValue={new Date().toISOString().split('T')[0]}
                            className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-red-500 outline-none"
                        />
                    </div>

                    <div className="pt-2 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                        >
                            {loading ? 'Guardando...' : 'Registrar Gasto'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
