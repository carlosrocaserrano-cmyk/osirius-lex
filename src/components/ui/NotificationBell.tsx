"use client";

import { useState, useEffect } from "react";
import { Bell, Check, ExternalLink } from "lucide-react";
import { getNotifications, markAsRead, runChecks } from "@/actions/notification-actions";
import Link from "next/link";

export function NotificationBell() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);

    const refresh = async () => {
        // Trigger checks (in a real app, do this periodically or via cron, not on every bell click)
        // Here we do it for demo purposes so the user sees results immediately.
        await runChecks();

        const data = await getNotifications();
        setNotifications(data);
        setHasUnread(data.some((n: any) => !n.read));
    };

    useEffect(() => {
        refresh();
        // Poll every minute
        const interval = setInterval(refresh, 60000);
        return () => clearInterval(interval);
    }, []);

    const handleMarkRead = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        await markAsRead(id);
        refresh();
    };

    return (
        <div className="relative">
            <button
                onClick={() => { setIsOpen(!isOpen); refresh(); }}
                className="relative p-2 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
            >
                <Bell size={20} />
                {hasUnread && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#121215]"></span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-[#1e1e24] border border-gray-800 rounded-xl shadow-2xl z-50 overflow-hidden">
                    <div className="p-3 border-b border-gray-800 flex justify-between items-center bg-[#25252d]">
                        <h3 className="font-bold text-white text-sm">Notificaciones</h3>
                        <span className="text-xs text-gray-500">{notifications.filter(n => !n.read).length} nuevas</span>
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length > 0 ? (
                            notifications.map(n => (
                                <div key={n.id} className={`p-4 border-b border-gray-800 hover:bg-white/5 transition-colors ${!n.read ? 'bg-blue-500/5' : ''}`}>
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className={`text-sm font-medium ${!n.read ? 'text-white' : 'text-gray-400'}`}>{n.title}</h4>
                                        {!n.read && (
                                            <button onClick={(e) => handleMarkRead(n.id, e)} className="text-lime-400 hover:text-lime-300" title="Marcar como leída">
                                                <Check size={14} />
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-400 mb-2">{n.message}</p>
                                    {n.link && (
                                        <Link href={n.link} onClick={() => setIsOpen(false)} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                                            Ver detalles <ExternalLink size={10} />
                                        </Link>
                                    )}
                                    <span className="block text-[10px] text-gray-600 mt-2 text-right">
                                        {new Date(n.createdAt).toLocaleString()}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-gray-500 text-sm">
                                <Bell className="mx-auto mb-2 opacity-20" size={32} />
                                <p>No tienes notificaciones</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {isOpen && (
                <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
            )}
        </div>
    );
}
