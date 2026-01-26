"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, User, Briefcase, Loader2 } from "lucide-react";
import { globalSearch } from "@/actions/search-actions";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SearchInputProps {
    placeholder?: string;
}

export default function SearchInput({ placeholder }: SearchInputProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<{ clients: any[], cases: any[] } | null>(null);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            if (query.length >= 2) {
                setLoading(true);
                setIsOpen(true);
                try {
                    const data = await globalSearch(query);
                    setResults(data);
                } catch (error) {
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            } else {
                setResults(null);
                setIsOpen(false);
            }
        }, 300); // Debounce

        return () => clearTimeout(timeoutId);
    }, [query]);

    const clearSearch = () => {
        setQuery("");
        setResults(null);
        setIsOpen(false);
    };

    return (
        <div ref={containerRef} className="relative w-full max-w-md">
            <div className="relative">
                <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
                <input
                    type="text"
                    placeholder={placeholder || "Buscar clientes, expedientes..."}
                    className="w-full bg-[#16161a] border border-gray-800 rounded-lg py-2 pl-10 pr-10 text-sm text-white focus:outline-none focus:border-lime-500 transition-colors"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => { if (query.length >= 2) setIsOpen(true); }}
                />
                {query && (
                    <button onClick={clearSearch} className="absolute right-3 top-2.5 text-gray-500 hover:text-white">
                        <X size={16} />
                    </button>
                )}
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#1e293b] border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50">
                    {loading ? (
                        <div className="p-4 flex justify-center text-gray-500">
                            <Loader2 className="animate-spin" size={20} />
                        </div>
                    ) : results ? (
                        <div className="max-h-[60vh] overflow-y-auto">
                            {results.clients.length === 0 && results.cases.length === 0 && (
                                <div className="p-4 text-center text-sm text-gray-500">
                                    No se encontraron resultados
                                </div>
                            )}

                            {results.clients.length > 0 && (
                                <div className="py-2">
                                    <h4 className="px-4 py-1 text-xs font-bold text-gray-500 uppercase">Clientes</h4>
                                    {results.clients.map(client => (
                                        <Link
                                            key={client.id}
                                            href={`/clientes/${client.id}`}
                                            onClick={clearSearch}
                                            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700/50 transition-colors"
                                        >
                                            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                                                <User size={16} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-white truncate">{client.name}</p>
                                                <p className="text-xs text-gray-400">{client.identityDoc || "Sin Documento"}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {results.cases.length > 0 && (
                                <div className="py-2 border-t border-gray-700">
                                    <h4 className="px-4 py-1 text-xs font-bold text-gray-500 uppercase">Expedientes</h4>
                                    {results.cases.map(process => (
                                        <Link
                                            key={process.id}
                                            href={`/expedientes/${process.id}`}
                                            onClick={clearSearch}
                                            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700/50 transition-colors"
                                        >
                                            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                                                <Briefcase size={16} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-white truncate">{process.caratula}</p>
                                                <p className="text-xs text-gray-400 truncate">{process.expediente || process.ianus} • {process.client.name}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
}
