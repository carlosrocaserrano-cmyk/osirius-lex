"use client";

import { Calendar, Copy, Check, Smartphone } from "lucide-react";
import { useState, useEffect } from "react";

export function CalendarSyncWidget() {
    const [copied, setCopied] = useState(false);
    const [syncUrl, setSyncUrl] = useState("");

    useEffect(() => {
        // Construct the webcal URL dynamically based on current origin
        if (typeof window !== "undefined") {
            const protocol = window.location.protocol === "https:" ? "webcal:" : "webcal:";
            // webcal: protocol usually forces the calendar app to open
            const host = window.location.host;
            setSyncUrl(`${protocol}//${host}/api/calendar/default`);
        }
    }, []);

    const handleCopy = () => {
        navigator.clipboard.writeText(syncUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="glass-card p-6 mt-6 border-t border-blue-500/30">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2 text-blue-400">
                <Calendar size={20} />
                Sincronizar Calendario
            </h3>
            <p className="text-xs text-gray-400 mb-4">
                Suscríbete para ver tus vencimientos en tu iPhone o Mac.
            </p>

            <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                    <input
                        readOnly
                        value={syncUrl}
                        className="flex-1 bg-[#16161a] border border-gray-700 rounded px-3 py-2 text-xs text-gray-400 font-mono text-ellipsis"
                    />
                    <button
                        onClick={handleCopy}
                        className="p-2 bg-blue-600 hover:bg-blue-500 rounded text-white transition-colors"
                        title="Copiar Enlace"
                    >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                </div>

                <a
                    href={syncUrl}
                    className="flex items-center justify-center gap-2 w-full py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-xs font-bold rounded border border-blue-500/50 transition-all"
                >
                    <Smartphone size={14} /> iOS / Mac (Click para Suscribir)
                </a>
            </div>
        </div>
    );
}
