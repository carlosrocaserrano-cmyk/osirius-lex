"use client";

import { useState } from 'react';
import { Plus, Save, FileText } from 'lucide-react';
import { createTemplate } from '@/actions/document-actions';

export default function TemplateManager() {
    const [isCreating, setIsCreating] = useState(false);
    const [newData, setNewData] = useState({ name: '', category: 'Contratos', content: '' });

    const handleSave = async () => {
        if (!newData.name || !newData.content) return;
        await createTemplate(newData);
        setIsCreating(false);
        setNewData({ name: '', category: 'Contratos', content: '' });
    };

    if (!isCreating) {
        return (
            <div className="p-6 text-center border-2 border-dashed border-gray-700 rounded-xl hover:border-gray-500 transition-colors cursor-pointer" onClick={() => setIsCreating(true)}>
                <Plus className="mx-auto text-gray-500 mb-2" size={32} />
                <h3 className="text-gray-300 font-medium">Crear Nueva Plantilla</h3>
                <p className="text-sm text-gray-500">Define estructuras reutilizables para tus documentos.</p>
            </div>
        );
    }

    return (
        <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 space-y-4">
            <h3 className="text-lg font-bold text-white mb-4">Nueva Plantilla</h3>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-medium text-gray-400 mb-1 block">Nombre</label>
                    <input
                        type="text"
                        value={newData.name}
                        onChange={e => setNewData({ ...newData, name: e.target.value })}
                        className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-3 py-2 text-white outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Ej: Contrato de Iguala"
                    />
                </div>
                <div>
                    <label className="text-xs font-medium text-gray-400 mb-1 block">Categoría</label>
                    <select
                        value={newData.category}
                        onChange={e => setNewData({ ...newData, category: e.target.value })}
                        className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-3 py-2 text-white outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option>Contratos</option>
                        <option>Demandas</option>
                        <option>Cartas</option>
                        <option>Memoriales</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="text-xs font-medium text-gray-400 mb-1 block">
                    Contenido
                    <span className="ml-2 text-gray-500 font-normal">(Usa {'{{variable}}'} para insertar datos dinámicos)</span>
                </label>
                <div className="flex gap-2 mb-2 flex-wrap">
                    {['client_name', 'doc_number', 'case_caratula'].map(v => (
                        <button
                            key={v}
                            onClick={() => setNewData({ ...newData, content: newData.content + ` {{${v}}} ` })}
                            className="bg-gray-800 text-xs px-2 py-1 rounded text-indigo-400 hover:text-indigo-300"
                        >
                            {v}
                        </button>
                    ))}
                </div>
                <textarea
                    value={newData.content}
                    onChange={e => setNewData({ ...newData, content: e.target.value })}
                    rows={10}
                    className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-3 py-2 text-white font-mono text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Escribe el contenido del documento aquí..."
                />
            </div>

            <div className="flex justify-end gap-3 pt-2">
                <button
                    onClick={() => setIsCreating(false)}
                    className="px-4 py-2 text-sm text-gray-400 hover:text-white"
                >
                    Cancelar
                </button>
                <button
                    onClick={handleSave}
                    className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                >
                    <Save size={16} />
                    Guardar Plantilla
                </button>
            </div>
        </div>
    );
}
