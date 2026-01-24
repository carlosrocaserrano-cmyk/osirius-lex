"use client";

import { useState } from "react";
import { updateSettings } from "@/actions/settings-actions";
import { Save, User, Building2, Phone, Mail, MapPin, CheckCircle2 } from "lucide-react";

export default function SettingsPage({ settings }: { settings: any }) {
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    async function handleSubmit(formData: FormData) {
        setIsSaving(true);
        await updateSettings(formData);
        setIsSaving(false);
        setLastSaved(new Date());
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-white mb-2">Configuración y Personalización</h1>
            <p className="text-gray-400">Estos datos aparecerán en los encabezados de tus informes y escritos generados.</p>

            <form action={handleSubmit} className="glass-card p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Personal Info */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-lime-400 border-b border-gray-800 pb-2">Datos del Abogado</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Nombre Completo</label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 text-gray-500" size={18} />
                                <input name="name" defaultValue={settings?.name} className="w-full bg-[#1a1a20] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-lime-500 transition-colors" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Nombre del Estudio / Firma</label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-2.5 text-gray-500" size={18} />
                                <input name="firmName" defaultValue={settings?.firmName} placeholder="Ej: Estudio Jurídico Pérez & Asoc." className="w-full bg-[#1a1a20] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-lime-500 transition-colors" />
                            </div>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-lime-400 border-b border-gray-800 pb-2">Datos de Contacto</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Email Profesional</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 text-gray-500" size={18} />
                                <input name="email" defaultValue={settings?.email} placeholder="contacto@estudio.com" className="w-full bg-[#1a1a20] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-lime-500 transition-colors" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Teléfono / WhatsApp</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-2.5 text-gray-500" size={18} />
                                <input name="phone" defaultValue={settings?.phone} placeholder="+54 9 11 ..." className="w-full bg-[#1a1a20] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-lime-500 transition-colors" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Dirección del Estudio</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-2.5 text-gray-500" size={18} />
                                <input name="address" defaultValue={settings?.address} placeholder="Av. Corrientes 1234, CABA" className="w-full bg-[#1a1a20] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-lime-500 transition-colors" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex items-center justify-between pt-6 border-t border-gray-800">
                    <div className="text-sm text-lime-400 flex items-center gap-2">
                        {lastSaved && (
                            <>
                                <CheckCircle2 size={16} />
                                Guardado {lastSaved.toLocaleTimeString()}
                            </>
                        )}
                    </div>
                    <button disabled={isSaving} type="submit" className="bg-lime-500 hover:bg-lime-400 text-black font-bold px-8 py-3 rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-lime-500/20 disabled:opacity-50">
                        <Save size={20} />
                        {isSaving ? "Guardando..." : "Guardar Cambios"}
                    </button>
                </div>
            </form>
        </div>
    );
}
