"use client";

import { useEffect } from "react";
import { Printer } from "lucide-react";

export function ReceiptView({ payment }: { payment: any }) {

    // Auto-print on load
    useEffect(() => {
        // Short delay to ensure styles are loaded
        const timer = setTimeout(() => {
            window.print();
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-white text-black p-10 flex flex-col items-center">
            <div className="max-w-2xl w-full border-2 border-black p-8 relative">

                {/* Header */}
                <div className="border-b-2 border-black pb-6 mb-6 flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold uppercase tracking-wider">Osirius Lex</h1>
                        <p className="text-sm text-gray-600 mt-1">Servicios Legales Integrales</p>
                    </div>
                    <div className="text-right">
                        <div className="inline-block border-2 border-black px-4 py-2 text-center">
                            <span className="block text-xs uppercase font-bold text-gray-500">Recibo N°</span>
                            <span className="text-xl font-bold font-mono">#{payment.id.slice(-6).toUpperCase()}</span>
                        </div>
                    </div>
                </div>

                {/* Date & Info */}
                <div className="flex justify-between items-end mb-8">
                    <div className="text-sm">
                        <p><span className="font-bold">Fecha:</span> {new Date(payment.date).toLocaleDateString()}</p>
                        <p><span className="font-bold">Lugar:</span> Buenos Aires</p>
                    </div>
                </div>

                {/* Client Data */}
                <div className="mb-8 p-4 bg-gray-100 rounded-sm">
                    <p className="mb-2"><span className="font-bold uppercase text-xs text-gray-500">Recibí de:</span></p>
                    <p className="text-lg font-medium">{payment.client.name}</p>
                    <p className="text-sm text-gray-600">{payment.client.email} | {payment.client.phone}</p>
                </div>

                {/* Amount */}
                <div className="mb-8">
                    <p className="mb-2"><span className="font-bold uppercase text-xs text-gray-500">La suma de:</span></p>
                    <div className="text-3xl font-bold font-mono border-b border-black pb-2">
                        ${payment.amount.toLocaleString()}
                    </div>
                </div>

                {/* Concept */}
                <div className="mb-12">
                    <p className="mb-2"><span className="font-bold uppercase text-xs text-gray-500">En concepto de:</span></p>
                    <p className="text-lg italic px-2 py-1 border-l-4 border-gray-300">{payment.concept}</p>
                </div>

                {/* Signatures */}
                <div className="flex justify-between mt-20 pt-8">
                    <div className="text-center w-40">
                        <div className="border-t border-black mb-2"></div>
                        <p className="text-xs uppercase text-gray-500">Firma Conforme</p>
                    </div>
                    <div className="text-center w-40">
                        <div className="border-t border-black mb-2"></div>
                        <p className="text-xs uppercase text-gray-500">Osirius Lex</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center text-[10px] text-gray-400 mt-12 pt-4 border-t border-gray-100">
                    Documento generado electrónicamente por Osirius Lex System el {new Date().toLocaleString()}
                </div>
            </div>

            {/* Print Button (Hide in print) */}
            <button
                onClick={() => window.print()}
                className="mt-8 flex items-center gap-2 px-6 py-3 bg-black text-white hover:bg-gray-800 rounded-full print:hidden shadow-xl"
            >
                <Printer size={20} />
                Imprimir Recibo
            </button>

            <style jsx global>{`
                @media print {
                    @page { margin: 0; }
                    body { -webkit-print-color-adjust: exact; }
                }
            `}</style>
        </div>
    );
}
