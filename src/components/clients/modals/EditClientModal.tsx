"use client";

import { Modal } from "@/components/ui/Modal";
import { updateClient, deleteClient } from "@/actions/client-actions";
import { useState } from "react";
import { User, Mail, Phone, Activity } from "lucide-react";

interface EditClientModalProps {
    isOpen: boolean;
    onClose: () => void;
    client: {
        id: string;
        name: string;
        email: string;
        phone: string;
        status: string;
        identityDoc?: string;
        address?: string;
        representative?: string;
        totalAgreedFee?: number;
    };
}

export function EditClientModal({ isOpen, onClose, client }: EditClientModalProps) {
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        try {
            await updateClient(client.id, formData);
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Editar Cliente">
            <form action={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Nombre Completo</label>
                    <div className="relative">
                        <User className="absolute left-3 top-2.5 text-gray-500" size={18} />
                        <input
                            name="name"
                            defaultValue={client.name}
                            required
                            className="w-full bg-[#25252d] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-lime-500 transition-colors"
                        />
                    </div>
                </div>



                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">CI / NIT</label>
                        <div className="relative">
                            <Activity className="absolute left-3 top-2.5 text-gray-500" size={18} />
                            <input
                                name="identityDoc"
                                defaultValue={client.identityDoc}
                                className="w-full bg-[#25252d] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-lime-500 transition-colors"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Representante Legal</label>
                        <div className="relative">
                            <User className="absolute left-3 top-2.5 text-gray-500" size={18} />
                            <input
                                name="representative"
                                defaultValue={client.representative}
                                className="w-full bg-[#25252d] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-lime-500 transition-colors"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Dirección</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-2.5 text-gray-500" size={18} />
                        <input
                            name="address"
                            defaultValue={client.address}
                            className="w-full bg-[#25252d] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-lime-500 transition-colors"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Monto Acordado Global ($)</label>
                    <div className="relative">
                        {/* Reusing DollarSign if available or generic icon */}
                        <div className="absolute left-3 top-2.5 text-gray-500 text-lg">$</div>
                        <input
                            name="totalAgreedFee"
                            type="number"
                            step="0.01"
                            defaultValue={client.totalAgreedFee}
                            placeholder="0.00"
                            className="w-full bg-[#25252d] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-lime-500 transition-colors"
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Este monto se usará para calcular el progreso de pagos.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 text-gray-500" size={18} />
                            <input
                                name="email"
                                type="email"
                                defaultValue={client.email}
                                className="w-full bg-[#25252d] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-lime-500 transition-colors"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Teléfono</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-2.5 text-gray-500" size={18} />
                            <input
                                name="phone"
                                defaultValue={client.phone}
                                className="w-full bg-[#25252d] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-lime-500 transition-colors"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Estado</label>
                    <div className="relative">
                        <Activity className="absolute left-3 top-2.5 text-gray-500" size={18} />
                        <select
                            name="status"
                            defaultValue={client.status}
                            className="w-full bg-[#25252d] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-lime-500 transition-colors appearance-none"
                        >
                            <option value="Activo">Activo</option>
                            <option value="Inactivo">Inactivo</option>
                            <option value="En Espera">En Espera</option>
                        </select>
                    </div>
                </div>

                <button disabled={isLoading} type="submit" className="w-full mt-6 bg-lime-500 hover:bg-lime-400 text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50">
                    {isLoading ? "Guardando..." : "Guardar Cambios"}
                </button>
            </form>

            {/* DANGER ZONE */}
            <div className="mt-8 pt-8 border-t border-red-900/30">
                <h4 className="text-red-500 font-bold mb-2">Zona de Peligro</h4>
                <p className="text-sm text-gray-500 mb-4">
                    Eliminar este cliente borrará también todos sus casos, pagos y documentos. Esta acción no se puede deshacer.
                </p>

                <DeleteClientSection clientId={client.id} />
            </div>
        </Modal >
    );
}

function DeleteClientSection({ clientId }: { clientId: string }) {
    const [confirmText, setConfirmText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    // Use window.location for full refresh after delete since we are in a modal

    const handleDelete = async () => {
        if (confirmText !== "ELIMINAR") return;
        setIsDeleting(true);
        try {
            await deleteClient(clientId);
            // Force redirect to clients list
            window.location.href = "/clientes";
        } catch (error) {
            console.error(error);
            setIsDeleting(false);
        }
    };

    return (
        <div className="bg-red-900/10 border border-red-900/30 rounded-lg p-4">
            <label className="block text-xs text-red-400 mb-2">
                Escribe <strong>ELIMINAR</strong> para confirmar:
            </label>
            <div className="flex gap-2">
                <input
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder="ELIMINAR"
                    className="flex-1 bg-[#1a1a20] border border-red-900/50 rounded px-3 py-2 text-red-500 placeholder-red-900/50 focus:outline-none focus:border-red-500"
                />
                <button
                    onClick={handleDelete}
                    disabled={confirmText !== "ELIMINAR" || isDeleting}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded transition-colors"
                >
                    {isDeleting ? "..." : "Eliminar"}
                </button>
            </div>
        </div>
    );
}
