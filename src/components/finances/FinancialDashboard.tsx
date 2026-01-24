"use client";

import { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Wallet, Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import AddGlobalExpenseModal from './AddGlobalExpenseModal';

interface DashboardProps {
    stats: {
        totalIncome: number;
        totalExpenses: number;
        netProfit: number;
        taxEstimate: number;
    };
    transactions: any[];
}

export default function FinancialDashboard({ stats, transactions }: DashboardProps) {
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Finanzas Globales</h1>
                    <p className="text-gray-400">Resumen económico de tu estudio jurídico.</p>
                </div>
                <button
                    onClick={() => setIsExpenseModalOpen(true)}
                    className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                    <Plus size={20} />
                    Registrar Gasto
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="p-6 rounded-xl bg-[#1e293b] border border-gray-700/50">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                            <TrendingUp size={24} />
                        </div>
                        <span className="text-xs text-gray-500 font-mono">INGRESOS TOTALES</span>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">Bs {stats.totalIncome.toLocaleString()}</div>
                    <p className="text-xs text-emerald-400 flex items-center gap-1">
                        <ArrowUpRight size={12} /> +100% vs mes anterior
                    </p>
                </div>

                <div className="p-6 rounded-xl bg-[#1e293b] border border-gray-700/50">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-red-500/10 rounded-lg text-red-400">
                            <TrendingDown size={24} />
                        </div>
                        <span className="text-xs text-gray-500 font-mono">GASTOS TOTALES</span>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">Bs {stats.totalExpenses.toLocaleString()}</div>
                    <p className="text-xs text-gray-500">Operativos y de Clientes</p>
                </div>

                <div className="p-6 rounded-xl bg-[#1e293b] border border-gray-700/50 relative overflow-hidden">
                    <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${stats.netProfit >= 0 ? 'from-lime-500/20' : 'from-red-500/20'} to-transparent rounded-bl-full`} />
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-2 rounded-lg ${stats.netProfit >= 0 ? 'bg-lime-500/10 text-lime-400' : 'bg-red-500/10 text-red-400'}`}>
                            <Wallet size={24} />
                        </div>
                        <span className="text-xs text-gray-500 font-mono">BENEFICIO NETO</span>
                    </div>
                    <div className={`text-2xl font-bold ${stats.netProfit >= 0 ? 'text-lime-400' : 'text-red-400'} mb-1`}>
                        Bs {stats.netProfit.toLocaleString()}
                    </div>
                    <p className="text-xs text-gray-500">Rentabilidad Real</p>
                </div>

                <div className="p-6 rounded-xl bg-[#1e293b] border border-gray-700/50">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                            <DollarSign size={24} />
                        </div>
                        <span className="text-xs text-gray-500 font-mono">IMPUESTOS EST.</span>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">Bs {stats.taxEstimate.toLocaleString()}</div>
                    <p className="text-xs text-gray-500">Aprox. 16% (IVA+IT)</p>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-[#1e293b] rounded-xl border border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-700 bg-[#0f172a]">
                    <h3 className="font-bold text-white">Transacciones Recientes</h3>
                </div>
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#0f172a] text-gray-400 text-xs uppercase">
                        <tr>
                            <th className="p-4 font-medium">Fecha</th>
                            <th className="p-4 font-medium">Concepto</th>
                            <th className="p-4 font-medium">Entidad / Cliente</th>
                            <th className="p-4 font-medium">Categoría</th>
                            <th className="p-4 font-medium text-right">Monto</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/50">
                        {transactions.map((tx) => (
                            <tr key={`${tx.type}-${tx.id}`} className="hover:bg-gray-800/50 transition-colors">
                                <td className="p-4 text-sm text-gray-400">{tx.date.toLocaleDateString()}</td>
                                <td className="p-4 text-sm font-medium text-white">
                                    <div className="flex items-center gap-2">
                                        {tx.type === 'INCOME'
                                            ? <ArrowUpRight size={16} className="text-emerald-500" />
                                            : <ArrowDownRight size={16} className="text-red-500" />
                                        }
                                        {tx.concept}
                                    </div>
                                </td>
                                <td className="p-4 text-sm text-gray-300">{tx.entity}</td>
                                <td className="p-4 text-sm">
                                    <span className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-400 border border-gray-700">
                                        {tx.category}
                                    </span>
                                </td>
                                <td className={`p-4 text-sm font-bold text-right ${tx.type === 'INCOME' ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {tx.type === 'INCOME' ? '+' : '-'} Bs {tx.amount.toLocaleString()}
                                </td>
                            </tr>
                        ))}
                        {transactions.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-500">No hay movimientos registrados.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Simulating a Chart with CSS Bars */}
            <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700">
                <h3 className="font-bold text-white mb-6">Resumen Visual</h3>
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Ingresos (vs Meta 50k)</span>
                            <span>{Math.min(100, (stats.totalIncome / 50000) * 100).toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${Math.min(100, (stats.totalIncome / 50000) * 100)}%` }}></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Gastos (Límite sugerido 30%)</span>
                            <span>{stats.totalIncome > 0 ? ((stats.totalExpenses / stats.totalIncome) * 100).toFixed(0) : 0}%</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                            <div className="bg-red-500 h-full rounded-full" style={{ width: `${stats.totalIncome > 0 ? Math.min(100, (stats.totalExpenses / stats.totalIncome) * 100) : 0}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>

            <AddGlobalExpenseModal
                isOpen={isExpenseModalOpen}
                onClose={() => setIsExpenseModalOpen(false)}
            />
        </div>
    );
}
