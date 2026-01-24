"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, FileText, Download, Printer, Plus, MessageSquare } from "lucide-react";
import { AddUpdateModal } from "@/components/cases/modals/AddUpdateModal";
import { generatePDFReport, generateWordReport } from "@/lib/reports";

export default function CaseDetailsPage({ caseData, userSettings }: { caseData: any, userSettings: any }) {
    const [isAddUpdateOpen, setIsAddUpdateOpen] = useState(false);

    const handleExportPDF = () => {
        generatePDFReport(caseData, caseData.updates, userSettings);
    };

    const handleExportWord = () => {
        generateWordReport(caseData, caseData.updates, userSettings);
    };

    return (
        <div className="h-full flex flex-col space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-3">
                    <Link href={`/clientes/${caseData.clientId}`} className="p-2 rounded-lg bg-[#25252d] hover:bg-lime-500/20 hover:text-lime-400 text-gray-400 transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white leading-tight">{caseData.caratula}</h1>
                        <p className="text-gray-400 text-sm">Exp: {caseData.expediente} • {caseData.juzgado}</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button onClick={handleExportPDF} className="bg-[#25252d] hover:bg-red-500/20 hover:text-red-400 text-gray-300 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors border border-gray-700 hover:border-red-500/30">
                        <Download size={18} />
                        PDF
                    </button>
                    <button onClick={handleExportWord} className="bg-[#25252d] hover:bg-blue-500/20 hover:text-blue-400 text-gray-300 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors border border-gray-700 hover:border-blue-500/30">
                        <FileText size={18} />
                        Word
                    </button>
                    <button
                        onClick={() => setIsAddUpdateOpen(true)}
                        className="bg-lime-500 hover:bg-lime-400 text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-lg shadow-lime-500/20"
                    >
                        <Plus size={18} />
                        Nuevo Movimiento
                    </button>
                </div>
            </div>

            {/* Timeline Area */}
            <div className="flex-1 glass-card p-6 overflow-hidden flex flex-col">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-gray-800 pb-4">
                    <Clock className="text-lime-400" />
                    Línea de Tiempo del Proceso
                </h2>

                <div className="flex-1 overflow-y-auto pr-2 space-y-8 relative before:absolute before:inset-y-0 before:left-[19px] before:w-0.5 before:bg-gray-800">
                    {caseData.updates.map((update: any) => (
                        <div key={update.id} className="relative flex gap-6">
                            {/* Dot */}
                            <div className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-4 border-[#0f0f13] bg-gray-800 text-lime-400">
                                <div className="w-3 h-3 rounded-full bg-lime-500"></div>
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <div className="p-4 rounded-xl bg-[#16161a] border border-gray-800 hover:border-lime-500/30 transition-all group">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-white">{update.title}</h3>
                                        <span className="text-xs text-gray-500 font-mono">{new Date(update.date).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-gray-400 text-sm whitespace-pre-wrap">{update.description}</p>

                                    {update.response && (
                                        <div className="mt-3 pt-3 border-t border-gray-800 flex items-start gap-2">
                                            <MessageSquare size={16} className="text-blue-400 mt-0.5" />
                                            <div>
                                                <span className="text-xs font-bold text-blue-400 block mb-0.5">Respuesta / Estado:</span>
                                                <p className="text-sm text-gray-300 italic">"{update.response}"</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {caseData.updates.length === 0 && (
                        <div className="text-center py-20 text-gray-500">
                            <p>No hay movimientos registrados en este expediente.</p>
                            <p className="text-sm mt-2">Usa el botón "Nuevo Movimiento" para comenzar el historial.</p>
                        </div>
                    )}
                </div>
            </div>

            <AddUpdateModal
                isOpen={isAddUpdateOpen}
                onClose={() => setIsAddUpdateOpen(false)}
                caseId={caseData.id}
            />
        </div>
    );
}
