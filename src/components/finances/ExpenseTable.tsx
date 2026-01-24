'use client';

import { Suspense, useState, useTransition } from 'react';
import { addExpense, deleteExpense } from '@/actions/expense-actions';
import { Trash2, Plus, Receipt } from 'lucide-react';

interface Expense {
    id: string;
    description: string;
    amount: number;
    date: Date;
    category: string;
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
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-gray-500" />
                    Gastos del Trámite
                </h3>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-md flex items-center gap-1 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    {isAdding ? 'Cancelar' : 'Nuevo Gasto'}
                </button>
            </div>

            {isAdding && (
                <form onSubmit={handleAdd} className="bg-gray-50 p-4 rounded-lg border border-gray-200 animate-in fade-in slide-in-from-top-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input
                            type="text"
                            placeholder="Descripción (ej. Fotocopias)"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="bg-white border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                        <div className="relative">
                            <span className="absolute left-3 top-2 text-gray-500 text-sm">$</span>
                            <input
                                type="number"
                                placeholder="Monto"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="bg-white border rounded px-3 py-2 pl-6 text-sm w-full focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="bg-black text-white rounded px-4 py-2 text-sm hover:bg-gray-800 disabled:opacity-50 transition-colors"
                        >
                            {isPending ? 'Guardando...' : 'Registrar'}
                        </button>
                    </div>
                </form>
            )}

            <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium">
                        <tr>
                            <th className="px-4 py-3">Fecha</th>
                            <th className="px-4 py-3">Descripción</th>
                            <th className="px-4 py-3 text-right">Monto</th>
                            <th className="px-4 py-3 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {expenses.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                                    No hay gastos registrados.
                                </td>
                            </tr>
                        ) : (
                            expenses.map((expense) => (
                                <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 text-gray-600">
                                        {new Date(expense.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3 font-medium text-gray-900">
                                        {expense.description}
                                    </td>
                                    <td className="px-4 py-3 text-right font-mono text-gray-700">
                                        ${expense.amount.toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            onClick={() => handleDelete(expense.id)}
                                            disabled={isPending}
                                            className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50"
                                            title="Eliminar"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                    <tfoot className="bg-gray-50 font-semibold text-gray-900 border-t border-gray-200">
                        <tr>
                            <td colSpan={2} className="px-4 py-3 text-right">Total Gastos:</td>
                            <td className="px-4 py-3 text-right text-red-600">${totalExpenses.toFixed(2)}</td>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
}
