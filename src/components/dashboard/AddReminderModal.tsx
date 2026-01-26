"use client";

import { useState } from 'react';
import { X, Calendar, Clock, Bell } from 'lucide-react';
import { createReminder } from '@/actions/reminder-actions';

interface AddReminderModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddReminderModal({ isOpen, onClose }: AddReminderModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        type: 'reunion'
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Combine date and time
            const dateObj = new Date(`${formData.date}T${formData.time || '09:00'}`);

            await createReminder({
                title: formData.title,
                description: formData.description,
                date: dateObj,
                type: formData.type
            });

            onClose();
            // Reset form
            setFormData({ title: '', description: '', date: '', time: '', type: 'reunion' });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-[#1e293b] rounded-xl border border-gray-700 shadow-2xl w-full max-w-md overflow-hidden">
                <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-[#0f172a]">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Bell className="text-indigo-500" size={20} />
                        Nuevo Recordatorio
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="text-xs font-medium text-gray-400 mb-1 block">Título</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Ej: Llamar a cliente..."
                            className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-medium text-gray-400 mb-1 block">Tipo</label>
                            <select
                                value={formData.type}
                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                                className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                            >
                                <option value="reunion">Reunión</option>
                                <option value="audiencia">Audiencia</option>
                                <option value="tramite">Trámite</option>
                                <option value="otro">Otro</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-400 mb-1 block">Hora</label>
                            <input
                                type="time"
                                required
                                value={formData.time}
                                onChange={e => setFormData({ ...formData, time: e.target.value })}
                                className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-medium text-gray-400 mb-1 block">Fecha</label>
                        <input
                            type="date"
                            required
                            value={formData.date}
                            onChange={e => setFormData({ ...formData, date: e.target.value })}
                            className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-medium text-gray-400 mb-1 block">Detalles (Opcional)</label>
                        <textarea
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Notas adicionales..."
                            rows={3}
                            className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                        />
                    </div>

                    <div className="pt-2 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                        >
                            {loading ? 'Guardando...' : 'Crear Recordatorio'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
