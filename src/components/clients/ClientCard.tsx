import { Client } from "@/types/client";
import Link from "next/link";
import { Mail, Phone, MoreVertical, DollarSign, Folder } from "lucide-react";

interface ClientCardProps {
    client: Client;
}

export function ClientCard({ client }: ClientCardProps) {
    const statusColors = {
        'Activo': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        'Inactivo': 'bg-gray-500/10 text-gray-400 border-gray-500/20',
        'En Espera': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    };

    return (
        <Link href={`/clientes/${client.id}`} className="block">
            <div className="glass-card p-5 hover:border-lime-500/30 transition-all group cursor-pointer hover:scale-[1.02]">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-lime-500 to-emerald-600 flex items-center justify-center text-black font-bold text-lg">
<<<<<<< HEAD
                            {client.name?.charAt(0) || "?"}
                        </div>
                        <div>
                            <h3 className="text-white font-bold truncate max-w-[150px]">{client.name || "Sin Nombre"}</h3>
                            <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColors[client.status as keyof typeof statusColors] || 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
                                {client.status || "Desconocido"}
=======
                            {client.name.charAt(0)}
                        </div>
                        <div>
                            <h3 className="text-white font-bold truncate max-w-[150px]">{client.name}</h3>
                            <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColors[client.status]}`}>
                                {client.status}
>>>>>>> 0ea290dd5fe62da7bb8aae8eddc9b2648d3f1d75
                            </span>
                        </div>
                    </div>
                    <button className="text-gray-500 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-colors">
                        <MoreVertical size={18} />
                    </button>
                </div>

                <div className="space-y-3 mb-5">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Mail size={14} className="text-lime-400" />
                        <span className="truncate">{client.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Phone size={14} className="text-lime-400" />
                        <span>{client.phone}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                            <DollarSign size={10} /> Deuda
                        </span>
                        <span className={`font-medium ${client.debt > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                            ${client.debt.toLocaleString()}
                        </span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                            <Folder size={10} /> Casos
                        </span>
                        <span className="text-white font-medium">{client.caseCount}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
