'use client';

import { Suspense, useState, useTransition } from 'react';
import { addExpense, deleteExpense } from '@/actions/expense-actions';
import { Trash2, Plus, Receipt } from 'lucide-react';

interface Expense {
    id: string;
    description: string;
    amount: number;
    date: string | Date; // Allow string date from JSON serialization
    category: string;
    case?: { caratula: string };
}

export default function ExpenseTable({ expenses, clientId }: { expenses: Expense[], clientId: string }) {
    const [isPending, startTransition] = useTransition();
    const [isAdding, setIsAdding] = useState(false);

    // Form State
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            await addExpense(clientId, description, parseFloat(amount), new Date());
            setIsAdding(false);
            setDescription("");
            setAmount("");
        });
    };

    const handleDelete = (id: string) => {
        if (!confirm("¿Eliminar gasto?")) return;
        startTransition(async () => {
            await deleteExpense(id);
        });
    };

    const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-lime-400" />
                    Gastos del Trámite
                </h3>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="text-sm bg-[#25252d] hover:bg-lime-900/30 text-lime-400 border border-lime-500/30 px-3 py-1 rounded-md flex items-center gap-1 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    {isAdding ? 'Cancelar' : 'Nuevo Gasto'}
                </button>
            </div>

            {isAdding && (
                <form onSubmit={handleAdd} className="bg-[#1e1e24] p-4 rounded-lg border border-gray-800 animate-in fade-in slide-in-from-top-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input
                            type="text"
                            placeholder="Descripción (ej. Fotocopias)"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="bg-[#1a1a20] border border-gray-700 rounded px-3 py-2 text-sm text-white focus:ring-2 focus:ring-lime-500 outline-none placeholder:text-gray-600"
                            required
                        />
                        <div className="relative">
                            <span className="absolute left-3 top-2 text-gray-500 text-sm">$</span>
                            <input
                                type="number"
                                placeholder="Monto"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="bg-[#1a1a20] border border-gray-700 rounded px-3 py-2 pl-6 text-sm w-full text-white focus:ring-2 focus:ring-lime-500 outline-none placeholder:text-gray-600"
                                step="0.01"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="bg-lime-500 text-black font-bold rounded px-4 py-2 text-sm hover:bg-lime-400 disabled:opacity-50 transition-colors shadow-lg shadow-lime-500/20"
                        >
                            {isPending ? 'Guardando...' : 'Registrar'}
                        </button>
                    </div>
                </form>
            )}

            <div className="overflow-hidden rounded-lg border border-gray-800 shadow-sm bg-[#1e1e24]">
                <table className="w-full text-sm text-left">
                    <thead className="bg-[#25252d] text-gray-400 font-medium border-b border-gray-800">
                        <tr>
                            <th className="px-4 py-3">Fecha</th>
                            <th className="px-4 py-3">Descripción</th>
                            <th className="px-4 py-3 text-right">Monto</th>
                            <th className="px-4 py-3 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 text-gray-300">
                        {expenses.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                                    No hay gastos registrados.
                                </td>
                            </tr>
                        ) : (
                            expenses.map((expense) => (
                                <tr key={expense.id} className="hover:bg-gray-800/50 transition-colors">
                                    <td className="px-4 py-3 text-gray-400">
                                        {new Date(expense.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3 font-medium text-white">
                                        {expense.description}
                                        {expense.case && (
                                            <span className="block text-xs text-lime-500/80">
                                                {expense.case.caratula}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-right font-mono text-lime-400">
                                        ${expense.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            onClick={() => handleDelete(expense.id)}
                                            disabled={isPending}
                                            className="text-gray-500 hover:text-red-400 transition-colors p-1 rounded-md hover:bg-red-500/10"
                                            title="Eliminar"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                    <tfoot className="bg-[#25252d] font-semibold text-white border-t border-gray-800">
                        <tr>
                            <td colSpan={2} className="px-4 py-3 text-right">Total Gastos:</td>
                            <td className="px-4 py-3 text-right text-lime-400">${totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
}
