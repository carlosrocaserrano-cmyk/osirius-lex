"use client";

import { Modal } from "@/components/ui/Modal";
import { createCase } from "@/actions/client-actions";
import { useState } from "react";
import { Scale, FileText, Hash, Building2 } from "lucide-react";

interface AddCaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    clientId: string;
}

export function AddCaseModal({ isOpen, onClose, clientId }: AddCaseModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isJuridica, setIsJuridica] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        try {
            await createCase(clientId, formData);
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Nuevo Proceso Judicial">
            <form action={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Carátula / Título</label>
                    <div className="relative">
                        <FileText className="absolute left-3 top-2.5 text-gray-500" size={18} />
                        <input name="caratula" required placeholder="Ej: Perez c/ Garcia s/ Sucesión" className="w-full bg-[#25252d] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-lime-500 transition-colors" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Tipo de Proceso</label>
                        <div className="relative">
                            <Scale className="absolute left-3 top-2.5 text-gray-500" size={18} />
                            <select name="tipo" className="w-full bg-[#25252d] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-lime-500 transition-colors appearance-none" >
                                <option value="Civil">Civil</option>
                                <option value="Penal">Penal</option>
                                <option value="Laboral">Laboral</option>
                                <option value="Familia">Familia</option>
                                <option value="Sucesión">Sucesión</option>
                                <option value="Administrativo">Administrativo</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Juzgado</label>
                        <div className="relative">
                            <Building2 className="absolute left-3 top-2.5 text-gray-500" size={18} />
                            <input name="juzgado" placeholder="Ej: Juzg. Civil y Com. N° 4" className="w-full bg-[#25252d] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-lime-500 transition-colors" />
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 mb-2 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                    <input type="checkbox" id="isJuridica" name="isJuridica" value="true" onChange={(e) => setIsJuridica(e.target.checked)} className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-lime-500" />
                    <label htmlFor="isJuridica" className="text-sm text-gray-300 font-medium cursor-pointer">
                        ¿Es Personería Jurídica? (Sin IANUS)
                    </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                            {isJuridica ? "N° Trámite / Resolución" : "IANUS"}
                        </label>
                        <div className="relative">
                            <Hash className="absolute left-3 top-2.5 text-gray-500" size={18} />
                            {isJuridica ? (
                                <input name="tramiteNumber" placeholder="Ej. Res. 123/24" className="w-full bg-[#25252d] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-lime-500 transition-colors" />
                            ) : (
                                <input name="ianus" placeholder="2024-..." className="w-full bg-[#25252d] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-lime-500 transition-colors" />
                            )}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">N° Expediente</label>
                        <div className="relative">
                            <Hash className="absolute left-3 top-2.5 text-gray-500" size={18} />
                            <input name="expediente" placeholder="123/24" className="w-full bg-[#25252d] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-lime-500 transition-colors" />
                        </div>
                    </div>
                </div>

                <button disabled={isLoading} type="submit" className="w-full mt-6 bg-lime-500 hover:bg-lime-400 text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50">
                    {isLoading ? "Guardando..." : "Crear Expediente"}
                </button>
            </form>
        </Modal>
    );
}
