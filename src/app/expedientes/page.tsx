import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FolderOpen, ArrowRight } from "lucide-react";

export default async function ExpedientesPage() {
    const cases = await prisma.case.findMany({
        include: {
            client: true,
            _count: {
                select: { updates: true }
            }
        },
        orderBy: { updatedAt: 'desc' }
    });

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white mb-2">Expedientes y Procesos</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {cases.map((c) => (
                    <Link href={`/expedientes/${c.id}`} key={c.id} className="block group">
                        <div className="glass-card p-6 h-full hover:border-lime-500/50 transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-lime-500/10 rounded-lg text-lime-400 group-hover:bg-lime-500 group-hover:text-black transition-colors">
                                    <FolderOpen size={24} />
                                </div>
                                <span className={`text-xs px-2 py-1 rounded font-bold uppercase ${c.estado === 'Terminado' ? 'bg-gray-800 text-gray-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                    {c.estado}
                                </span>
                            </div>

                            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-lime-400 transition-colors line-clamp-2">{c.caratula}</h3>
                            <p className="text-gray-400 text-sm mb-4">{c.client.name}</p>

                            <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-800 pt-3">
                                <span>Exp: {c.expediente || "S/D"}</span>
                                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                    {c._count.updates} actualizaciones <ArrowRight size={12} />
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}

                {cases.length === 0 && (
                    <div className="col-span-full text-center py-20 text-gray-500">
                        No hay expedientes registrados. Ve a un Cliente para crear uno.
                    </div>
                )}
            </div>
        </div>
    );
}
