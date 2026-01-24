
import { useState } from "react";
import { User, Mail, Phone, MapPin, CreditCard, Briefcase } from "lucide-react";

interface NewClientFormProps {
    onCancel: () => void;
    onSubmit: (data: any) => void;
}

export function NewClientForm({ onCancel, onSubmit }: NewClientFormProps) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        identityDoc: "",
        address: "",
        representative: ""
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                    <label className="text-sm font-medium text-gray-400">Nombre Completo / Razón Social</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            required
                            type="text"
                            placeholder="Ej. Juan Pérez o BOLHARP SRL"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-[#16161a] border border-gray-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-lime-500 transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">CI / NIT</label>
                    <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="1234567 SC"
                            value={formData.identityDoc}
                            onChange={(e) => setFormData({ ...formData, identityDoc: e.target.value })}
                            className="w-full bg-[#16161a] border border-gray-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-lime-500 transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">Rep. Legal (Si aplica)</label>
                    <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Ej. Hilton Leonardo..."
                            value={formData.representative}
                            onChange={(e) => setFormData({ ...formData, representative: e.target.value })}
                            className="w-full bg-[#16161a] border border-gray-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-lime-500 transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-2 col-span-2">
                    <label className="text-sm font-medium text-gray-400">Dirección</label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Av. Banzer 4to Anillo..."
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            className="w-full bg-[#16161a] border border-gray-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-lime-500 transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            required
                            type="email"
                            placeholder="juan@ejemplo.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-[#16161a] border border-gray-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-lime-500 transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">Teléfono</label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            required
                            type="tel"
                            placeholder="+591 7..."
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full bg-[#16161a] border border-gray-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-lime-500 transition-all"
                        />
                    </div>
                </div>
            </div>

            <div className="flex gap-3 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 py-3 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors font-medium"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-lime-500 hover:bg-lime-400 text-black font-bold shadow-lg shadow-lime-500/20 transition-all hover:scale-[1.02]"
                >
                    Guardar Cliente
                </button>
            </div>
        </form>
    );
}
