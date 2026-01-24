import { FileText, Plus, File } from "lucide-react";
import { getTemplates, getDocuments } from "@/actions/document-actions";
import TemplateManager from "@/components/documents/TemplateManager";
import GenerateDocumentButton from "@/components/documents/GenerateDocumentButton"; // Separate client component for the button to trigger modal

export default async function DocumentsPage() {
    const templates = await getTemplates();
    const documents = await getDocuments();

    return (
        <div className="p-8 pb-32 max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Centro de Documentos</h1>
                    <p className="text-gray-400">Gestiona tus plantillas y genera escritos legales automáticamente.</p>
                </div>
                <GenerateDocumentButton />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Templates */}
                <div className="lg:col-span-1 space-y-6">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                        <FileText className="text-indigo-400" />
                        Plantillas
                    </h2>

                    <TemplateManager />

                    <div className="space-y-3">
                        {templates.map(t => (
                            <div key={t.id} className="bg-[#1e293b] p-4 rounded-xl border border-gray-700/50 hover:border-gray-600 transition-colors">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-medium text-gray-200">{t.name}</h3>
                                    <span className="text-[10px] uppercase tracking-wider text-gray-500 bg-gray-800 px-2 py-1 rounded">{t.category}</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-2 line-clamp-2">{t.content}</p>
                            </div>
                        ))}
                        {templates.length === 0 && <p className="text-gray-500 text-sm">No hay plantillas creadas.</p>}
                    </div>
                </div>

                {/* Right Column: Generated Documents */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                        <File className="text-emerald-400" />
                        Documentos Recientes
                    </h2>

                    <div className="bg-[#1e293b] rounded-xl border border-gray-700 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-[#0f172a] text-gray-400 text-xs uppercase">
                                <tr>
                                    <th className="p-4 font-medium">Nombre</th>
                                    <th className="p-4 font-medium">Cliente</th>
                                    <th className="p-4 font-medium">Fecha</th>
                                    <th className="p-4 font-medium text-right">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700/50">
                                {documents.map(doc => (
                                    <tr key={doc.id} className="hover:bg-gray-800/50 transition-colors">
                                        <td className="p-4 text-sm font-medium text-white">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-indigo-500/10 rounded text-indigo-400">
                                                    <FileText size={16} />
                                                </div>
                                                {doc.name}
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-gray-400">{doc.client?.name || '---'}</td>
                                        <td className="p-4 text-sm text-gray-400">{doc.date.toLocaleDateString()}</td>
                                        <td className="p-4 text-right">
                                            <button className="text-xs font-medium text-indigo-400 hover:text-indigo-300">
                                                Descargar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {documents.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-gray-500">
                                            No se han generado documentos aún.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
