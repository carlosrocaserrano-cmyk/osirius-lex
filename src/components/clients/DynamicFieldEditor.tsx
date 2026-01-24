"use client";

import { useState } from "react";
import { Plus, Trash2, Save, X } from "lucide-react";
import { updateClientMetadata } from "@/actions/client-metadata-actions";

interface DynamicFieldEditorProps {
    clientId: string;
    initialMetadata?: string | null;
}

interface Field {
    key: string;
    value: string;
}

export function DynamicFieldEditor({ clientId, initialMetadata }: DynamicFieldEditorProps) {
    const [fields, setFields] = useState<Field[]>(() => {
        try {
            if (!initialMetadata) return [];
            const parsed = JSON.parse(initialMetadata);
            return Object.entries(parsed).map(([key, value]) => ({ key, value: String(value) }));
        } catch (e) {
            return [];
        }
    });

    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleAddField = () => {
        setFields([...fields, { key: "", value: "" }]);
    };

    const handleRemoveField = (index: number) => {
        const newFields = [...fields];
        newFields.splice(index, 1);
        setFields(newFields);
    };

    const handleFieldChange = (index: number, type: 'key' | 'value', text: string) => {
        const newFields = [...fields];
        newFields[index][type] = text;
        setFields(newFields);
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const metadataObject = fields.reduce((acc, field) => {
                if (field.key.trim()) {
                    acc[field.key.trim()] = field.value;
                }
                return acc;
            }, {} as Record<string, string>);

            await updateClientMetadata(clientId, JSON.stringify(metadataObject));
            setIsEditing(false);
        } catch (error) {
            console.error(error);
            alert("Error al guardar los campos dinámicos");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isEditing) {
        return (
            <div className="bg-[#1e1e24] rounded-lg p-6 border border-gray-800">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                        Datos Adicionales
                    </h3>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="text-sm text-lime-400 hover:text-lime-300 font-medium"
                    >
                        Editar Campos
                    </button>
                </div>

                {fields.length === 0 ? (
                    <p className="text-gray-500 italic text-sm">No hay datos adicionales registrados.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {fields.map((field, idx) => (
                            <div key={idx} className="bg-[#25252d] p-3 rounded border border-gray-700">
                                <span className="block text-xs uppercase text-gray-500 font-bold mb-1">{field.key}</span>
                                <span className="text-white">{field.value}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="bg-[#1e1e24] rounded-lg p-6 border border-gray-800 ring-1 ring-lime-500/50">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white">Editar Datos Adicionales</h3>
                <div className="flex gap-2">
                    <button
                        onClick={handleAddField}
                        className="p-1.5 rounded bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                        title="Agregar Campo"
                    >
                        <Plus size={16} />
                    </button>
                    <button
                        onClick={() => setIsEditing(false)}
                        className="p-1.5 rounded bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                        title="Cancelar"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>

            <div className="space-y-3 mb-6">
                {fields.map((field, idx) => (
                    <div key={idx} className="flex gap-2 items-start">
                        <input
                            type="text"
                            placeholder="Etiqueta (ej. Hobbie)"
                            value={field.key}
                            onChange={(e) => handleFieldChange(idx, 'key', e.target.value)}
                            className="bg-[#25252d] text-white border border-gray-700 rounded px-3 py-2 text-sm flex-1 focus:border-lime-500 outline-none"
                        />
                        <input
                            type="text"
                            placeholder="Valor (ej. Golf)"
                            value={field.value}
                            onChange={(e) => handleFieldChange(idx, 'value', e.target.value)}
                            className="bg-[#25252d] text-white border border-gray-700 rounded px-3 py-2 text-sm flex-1 focus:border-lime-500 outline-none"
                        />
                        <button
                            onClick={() => handleRemoveField(idx)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
                {fields.length === 0 && (
                    <p className="text-gray-500 text-center py-4 text-sm">Presiona + para agregar un nuevo campo personalizado.</p>
                )}
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-700">
                <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="bg-lime-500 hover:bg-lime-400 text-black font-bold py-2 px-6 rounded flex items-center gap-2 transition-all disabled:opacity-50"
                >
                    {isLoading ? "Guardando..." : <><Save size={18} /> Guardar Cambios</>}
                </button>
            </div>
        </div>
    );
}
