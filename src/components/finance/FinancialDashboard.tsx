"use client";

import { useState } from "react";
import { DollarSign, TrendingUp, TrendingDown, FileText, Download, Plus, Filter } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface FinancialDashboardProps {
    summary: {
        income: number;
        expenses: number;
        net: number;
        taxes: {
            liability: number;
            credit: number;
            payable: number;
        }
    };
    payments: any[];
    expenses: any[];
}

export function FinancialDashboard({ summary, payments, expenses }: FinancialDashboardProps) {
    const [activeTab, setActiveTab] = useState<'income' | 'expenses'>('income');

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-[#1e1e24] p-6 rounded-lg border border-gray-800">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-gray-400 text-sm font-medium uppercase">Ingresos Totales</span>
                        <div className="w-8 h-8 rounded-full bg-lime-500/20 flex items-center justify-center text-lime-400">
                            <TrendingUp size={16} />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-white">${summary.income.toLocaleString()}</p>
                </div>

                <div className="bg-[#1e1e24] p-6 rounded-lg border border-gray-800">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-gray-400 text-sm font-medium uppercase">Gastos Totales</span>
                        <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400">
                            <TrendingDown size={16} />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-white">${summary.expenses.toLocaleString()}</p>
                </div>

                <div className="bg-[#1e1e24] p-6 rounded-lg border border-gray-800">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-gray-400 text-sm font-medium uppercase">Flujo Neto</span>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${summary.net >= 0 ? 'bg-lime-500/20 text-lime-400' : 'bg-red-500/20 text-red-400'}`}>
                            <DollarSign size={16} />
                        </div>
                    </div>
                    <p className={`text-2xl font-bold ${summary.net >= 0 ? 'text-lime-400' : 'text-red-400'}`}>
                        ${summary.net.toLocaleString()}
                    </p>
                </div>

                <div className="bg-[#1e1e24] p-6 rounded-lg border border-gray-800 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-bl-full"></div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-gray-400 text-sm font-medium uppercase">Impuestos (Est.)</span>
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                                <FileText size={16} />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-white">${summary.taxes.payable.toLocaleString()}</p>
                        <p className="text-xs text-gray-500 mt-1">IVA + IT (menos crédito fiscal)</p>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Transaction List */}
                <div className="lg:col-span-2 bg-[#1e1e24] rounded-lg border border-gray-800 flex flex-col h-[600px]">
                    <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                        <div className="flex gap-2">
                            <button
                                onClick={() => setActiveTab('income')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'income' ? 'bg-lime-500 text-black' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                            >
                                Ingresos
                            </button>
                            <button
                                onClick={() => setActiveTab('expenses')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'expenses' ? 'bg-red-500 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                            >
                                Gastos
                            </button>
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg">
                                <Filter size={18} />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg">
                                <Download size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                        <table className="w-full text-left border-collapse">
                            <thead className="sticky top-0 bg-[#1e1e24] z-10">
                                <tr>
                                    <th className="p-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Fecha</th>
                                    <th className="p-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Concepto</th>
                                    <th className="p-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        {activeTab === 'income' ? 'Cliente' : 'Categoría'}
                                    </th>
                                    <th className="p-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Monto</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800/50">
                                {activeTab === 'income' ? (
                                    payments.map((p) => (
                                        <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                                            <td className="p-3 text-sm text-gray-400 font-mono">
                                                {format(new Date(p.date), 'dd/MM/yyyy', { locale: es })}
                                            </td>
                                            <td className="p-3 text-sm text-white font-medium">{p.concept}</td>
                                            <td className="p-3 text-sm text-gray-400">{p.client.name}</td>
                                            <td className="p-3 text-sm text-lime-400 font-bold text-right font-mono">
                                                +${p.amount.toLocaleString()}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    expenses.map((e) => (
                                        <tr key={e.id} className="hover:bg-white/5 transition-colors group">
                                            <td className="p-3 text-sm text-gray-400 font-mono">
                                                {format(new Date(e.date), 'dd/MM/yyyy', { locale: es })}
                                            </td>
                                            <td className="p-3 text-sm text-white font-medium">{e.description}</td>
                                            <td className="p-3 text-sm text-gray-400">
                                                <span className="px-2 py-0.5 rounded text-xs bg-gray-800 text-gray-300">{e.category}</span>
                                            </td>
                                            <td className="p-3 text-sm text-red-400 font-bold text-right font-mono">
                                                -${e.amount.toLocaleString()}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Panel: Analyitcs / Actions */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-[#1e1e24] to-[#16161a] p-6 rounded-lg border border-gray-800">
                        <h3 className="text-lg font-bold text-white mb-4">Acciones Rápidas</h3>
                        <div className="space-y-3">
                            <button className="w-full bg-lime-500 hover:bg-lime-400 text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all">
                                <Plus size={18} />
                                Registrar Ingreso
                            </button>
                            <button className="w-full bg-[#25252d] hover:bg-red-500/20 hover:text-red-400 text-gray-300 font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all border border-gray-700 hover:border-red-500/50">
                                <Plus size={18} />
                                Registrar Gasto
                            </button>
                        </div>
                    </div>

                    <div className="bg-[#1e1e24] p-6 rounded-lg border border-gray-800">
                        <h3 className="text-lg font-bold text-white mb-4">Desglose de Impuestos</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400">IVA Débito (13%)</span>
                                <span className="text-white font-mono">${(summary.income * 0.13).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400">IT (3%)</span>
                                <span className="text-white font-mono">${(summary.income * 0.03).toFixed(2)}</span>
                            </div>
                            <div className="h-px bg-gray-800 my-2"></div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400">Crédito Fiscal (Gastos)</span>
                                <span className="text-lime-400 font-mono">-${summary.taxes.credit.toFixed(2)}</span>
                            </div>
                            <div className="h-px bg-gray-800 my-2"></div>
                            <div className="flex justify-between items-center font-bold">
                                <span className="text-white">Total a Pagar</span>
                                <span className="text-white font-mono text-lg">${summary.taxes.payable.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
