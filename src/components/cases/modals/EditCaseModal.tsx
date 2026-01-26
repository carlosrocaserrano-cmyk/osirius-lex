"use client";

import { Modal } from "@/components/ui/Modal";
import { updateCase } from "@/actions/client-actions";
import { useState } from "react";
import { Scale, FileText, Hash, Building2, AlertCircle } from "lucide-react";

interface EditCaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    clientId: string;
    caseData: {
        id: string;
        caratula: string;
        juzgado: string;
        ianus: string;
        expediente: string;
        tipo: string;
        estado: string;
    };
}

export function EditCaseModal({ isOpen, onClose, clientId, caseData }: EditCaseModalProps) {
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        try {
            await updateCase(caseData.id, clientId, formData);
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Editar Expediente">
            <form action={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Carátula</label>
                    <div className="relative">
                        <FileText className="absolute left-3 top-2.5 text-gray-500" size={18} />
                        <input
                            name="caratula"
                            defaultValue={caseData.caratula}
                            required
                            className="w-full bg-[#25252d] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-lime-500 transition-colors"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Estado</label>
                        <div className="relative">
                            <AlertCircle className="absolute left-3 top-2.5 text-gray-500" size={18} />
                            <select
                                name="estado"
                                defaultValue={caseData.estado}
                                className="w-full bg-[#25252d] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-lime-500 transition-colors appearance-none"
                            >
                                <option value="En trámite">En trámite</option>
                                <option value="Sentencia">Sentencia</option>
                                <option value="Archivado">Archivado</option>
                                <option value="Mediación">Mediación</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Tipo</label>
                        <div className="relative">
                            <Scale className="absolute left-3 top-2.5 text-gray-500" size={18} />
                            <select
                                name="tipo"
                                defaultValue={caseData.tipo}
                                className="w-full bg-[#25252d] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-lime-500 transition-colors appearance-none"
                            >
                                <option value="Civil">Civil</option>
                                <option value="Penal">Penal</option>
                                <option value="Laboral">Laboral</option>
                                <option value="Familia">Familia</option>
                                <option value="Sucesión">Sucesión</option>
                                <option value="Administrativo">Administrativo</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Juzgado</label>
                    <div className="relative">
                        <Building2 className="absolute left-3 top-2.5 text-gray-500" size={18} />
                        <input
                            name="juzgado"
                            defaultValue={caseData.juzgado}
                            className="w-full bg-[#25252d] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-lime-500 transition-colors"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">IANUS</label>
                        <div className="relative">
                            <Hash className="absolute left-3 top-2.5 text-gray-500" size={18} />
                            <input
                                name="ianus"
                                defaultValue={caseData.ianus}
                                className="w-full bg-[#25252d] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-lime-500 transition-colors"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">N° Expediente</label>
                        <div className="relative">
                            <Hash className="absolute left-3 top-2.5 text-gray-500" size={18} />
                            <input
                                name="expediente"
                                defaultValue={caseData.expediente}
                                className="w-full bg-[#25252d] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-lime-500 transition-colors"
                            />
                        </div>
                    </div>
                </div>

                <button disabled={isLoading} type="submit" className="w-full mt-6 bg-lime-500 hover:bg-lime-400 text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50">
                    {isLoading ? "Guardando..." : "Guardar Cambios"}
                </button>
            </form>
        </Modal>
    );
}
