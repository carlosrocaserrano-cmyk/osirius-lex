"use client";

import { useState, useEffect } from 'react';
import { X, FileText, User, Scale, Download, RefreshCw } from 'lucide-react';
import { getTemplates, generateDocument } from '@/actions/document-actions';
import { getClients } from '@/actions/client-actions'; // Using getClients
import { getCases } from '@/actions/case-actions';
import jsPDF from 'jspdf';
import { injectHeader, injectFooter } from '@/lib/legal/branding';

interface GenerateDocumentModalProps {
    isOpen: boolean;
    onClose: () => void;
    preSelectedClientId?: string;
    preSelectedCaseId?: string;
    templates?: any[];
}

export default function GenerateDocumentModal({ isOpen, onClose, preSelectedClientId, preSelectedCaseId, templates: initialTemplates = [] }: GenerateDocumentModalProps) {
    const [step, setStep] = useState(1); // 1: Select Template, 2: Context, 3: Preview
    const [templates, setTemplates] = useState<any[]>(initialTemplates);
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

    // Context Selection
    const [clients, setClients] = useState<any[]>([]);
    const [cases, setCases] = useState<any[]>([]);
    const [selectedClient, setSelectedClient] = useState<string>(preSelectedClientId || "");
    const [selectedCase, setSelectedCase] = useState<string>(preSelectedCaseId || "");

    const [loading, setLoading] = useState(false);
    const [previewContent, setPreviewContent] = useState<string>("");

    useEffect(() => {
        if (isOpen) {
            if (initialTemplates.length === 0) {
                getTemplates().then(setTemplates);
            }
            getClients().then(setClients); // Might need optimization if many clients
            if (preSelectedClientId) {
                // If client pre-selected, fetch cases for that client ideally
                getCases().then(allCases => setCases(allCases.filter((c: any) => c.clientId === preSelectedClientId)));
            } else {
                getCases().then(setCases);
            }
        }
    }, [isOpen, preSelectedClientId, initialTemplates]);

    useEffect(() => {
        if (selectedClient) {
            getCases().then(allCases => setCases(allCases.filter((c: any) => c.clientId === selectedClient)));
        }
    }, [selectedClient]);

    const handlePreview = async () => {
        setLoading(true);
        try {
            const result = await generateDocument(selectedTemplate!, {
                clientId: selectedClient || undefined,
                caseId: selectedCase || undefined
            });
            setPreviewContent(result.content);
            setStep(3);
        } catch (error) {
            console.error(error);
            alert("Error generating preview");
        } finally {
            setLoading(false);
        }
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        injectHeader(doc, "DOCUMENTO GENERADO");

        const splitText = doc.splitTextToSize(previewContent, 170);
        let y = 60;

        // Simple pagination loop
        const pageHeight = doc.internal.pageSize.height;

        doc.setFont("times", "normal");
        doc.setFontSize(11);

        splitText.forEach((line: string) => {
            if (y > pageHeight - 30) {
                injectFooter(doc, "Osirius Lex");
                doc.addPage();
                y = 30;
            }
            doc.text(line, 20, y);
            y += 6;
        });

        injectFooter(doc, "Osirius Lex - Documento Verificado");
        doc.save("documento_generado.pdf");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-[#1e1e24] rounded-xl border border-gray-800 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-[#25252d]">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <FileText className="text-lime-500" size={20} />
                        Generar Documento
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
                    {step === 1 && (
                        <div className="space-y-4">
                            <h3 className="text-lime-400 font-medium mb-2 uppercase text-xs tracking-wider">1. Selecciona una Plantilla</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {templates.map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => setSelectedTemplate(t.id)}
                                        className={`p-4 rounded-lg border text-left transition-all ${selectedTemplate === t.id
                                            ? 'bg-lime-500/10 border-lime-500 text-white'
                                            : 'bg-[#25252d] border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200'
                                            }`}
                                    >
                                        <div className="font-bold">{t.name}</div>
                                        <div className="text-xs opacity-70 mt-1">{t.category}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <h3 className="text-lime-400 font-medium uppercase text-xs tracking-wider">2. Selecciona el Contexto</h3>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Cliente</label>
                                <select
                                    className="w-full bg-[#1a1a20] border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-lime-500 outline-none"
                                    value={selectedClient}
                                    onChange={(e) => setSelectedClient(e.target.value)}
                                >
                                    <option value="">Seleccionar Cliente...</option>
                                    {clients.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Caso (Opcional)</label>
                                <select
                                    className="w-full bg-[#1a1a20] border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-lime-500 outline-none"
                                    value={selectedCase}
                                    onChange={(e) => setSelectedCase(e.target.value)}
                                    disabled={!selectedClient}
                                >
                                    <option value="">Seleccionar Caso...</option>
                                    {cases.map(c => (
                                        <option key={c.id} value={c.id}>{c.caratula}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4 h-full flex flex-col">
                            <h3 className="text-lime-400 font-medium uppercase text-xs tracking-wider">3. Vista Previa</h3>
                            <div className="flex-1 bg-white text-black p-8 rounded shadow-inner overflow-y-auto font-serif text-sm whitespace-pre-wrap min-h-[300px]">
                                {previewContent}
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-gray-800 bg-[#25252d] flex justify-between">
                    {step > 1 && (
                        <button
                            onClick={() => setStep(step - 1)}
                            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                        >
                            Atrás
                        </button>
                    )}
                    <div className="ml-auto">
                        {step === 1 && (
                            <button
                                disabled={!selectedTemplate}
                                onClick={() => setStep(2)}
                                className="bg-lime-500 hover:bg-lime-400 disabled:opacity-50 text-black font-bold px-6 py-2 rounded-lg transition-colors shadow-lg shadow-lime-500/20"
                            >
                                Siguiente
                            </button>
                        )}
                        {step === 2 && (
                            <button
                                onClick={handlePreview}
                                disabled={loading}
                                className="bg-lime-500 hover:bg-lime-400 disabled:opacity-50 text-black font-bold px-6 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-lime-500/20"
                            >
                                {loading ? <RefreshCw className="animate-spin" size={16} /> : null}
                                Generar Vista Previa
                            </button>
                        )}
                        {step === 3 && (
                            <button
                                onClick={downloadPDF}
                                className="bg-lime-500 hover:bg-lime-400 text-black font-bold px-6 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-lime-500/20"
                            >
                                <Download size={18} />
                                Descargar PDF
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
