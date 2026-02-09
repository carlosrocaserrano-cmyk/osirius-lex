import { useState } from "react";
import { User, Mail, Phone, MapPin, CreditCard, Briefcase, Plus, X, Camera } from "lucide-react";

interface NewClientFormProps {
    onCancel: () => void;
    onSubmit: (data: any) => void;
}

export function NewClientForm({ onCancel, onSubmit }: NewClientFormProps) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        identityDoc: "",
        address: "",
        representative: "",
        wantsInvoice: false,
        photo: null as File | null
    });

    const [phones, setPhones] = useState<string[]>([""]);

    const handlePhoneChange = (index: number, value: string) => {
        const newPhones = [...phones];
        newPhones[index] = value;
        setPhones(newPhones);
    };

    const addPhone = () => {
        setPhones([...phones, ""]);
    };

    const removePhone = (index: number) => {
        const newPhones = phones.filter((_, i) => i !== index);
        setPhones(newPhones.length ? newPhones : [""]);
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, photo: e.target.files[0] });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            phones
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Photo Upload */}
                <div className="col-span-2 flex justify-center mb-4">
                    <div className="relative group cursor-pointer">
                        <div className="w-24 h-24 rounded-full bg-[#25252d] border-2 border-dashed border-gray-600 flex items-center justify-center overflow-hidden transition-colors hover:border-lime-500">
                            {formData.photo ? (
                                <img
                                    src={URL.createObjectURL(formData.photo)}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <Camera className="text-gray-500 group-hover:text-lime-500 transition-colors" size={32} />
                            )}
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <p className="text-xs text-gray-500 text-center mt-2 group-hover:text-lime-500 transition-colors">
                            {formData.photo ? "Cambiar foto" : "Subir foto"}
                        </p>
                    </div>
                </div>

                <div className="space-y-2 col-span-2">
                    <label className="text-sm font-medium text-gray-400">Nombre Completo / Razón Social <span className="text-red-500">*</span></label>
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
                            type="email"
                            placeholder="juan@ejemplo.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-[#16161a] border border-gray-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-lime-500 transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-2 col-span-2 md:col-span-1">
                    <div className="flex justify-between items-center mb-1">
                        <label className="text-sm font-medium text-gray-400">Teléfonos</label>
                        <button type="button" onClick={addPhone} className="text-xs text-lime-400 hover:text-white flex items-center gap-1">
                            <Plus size={12} /> Agregar
                        </button>
                    </div>
                    {phones.map((phone, index) => (
                        <div key={index} className="relative mb-2">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="tel"
                                placeholder="+591 7..."
                                value={phone}
                                onChange={(e) => handlePhoneChange(index, e.target.value)}
                                className="w-full bg-[#16161a] border border-gray-800 rounded-xl py-3 pl-10 pr-10 text-white focus:outline-none focus:border-lime-500 transition-all"
                            />
                            {phones.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removePhone(index)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-400 transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                <div className="col-span-2 flex items-center gap-2 pt-2">
                    <input
                        type="checkbox"
                        id="wantsInvoice"
                        checked={formData.wantsInvoice}
                        onChange={(e) => setFormData({ ...formData, wantsInvoice: e.target.checked })}
                        className="w-4 h-4 rounded border-gray-700 bg-[#16161a] text-lime-500 focus:ring-lime-500/50"
                    />
                    <label htmlFor="wantsInvoice" className="text-sm text-gray-400 select-none cursor-pointer">
                        Cliente requiere facturación automática
                    </label>
                </div>
            </div >

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
        </form >
    );
}
