"use client";

import { useState, useEffect } from 'react';
import { Bell, Check } from 'lucide-react';
import { getNotifications, markAsRead, clearAllNotifications } from '@/actions/notification-actions';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Notification = {
    id: string;
    title: string;
    message: string;
    type: string;
    read: boolean;
    link: string | null;
    createdAt: Date;
};

export default function NotificationsMenu() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const router = useRouter();

    const fetchNotifications = async () => {
        const data = await getNotifications();
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.read).length);
    };

    useEffect(() => {
        fetchNotifications();
        // Poll every minute
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    const handleMarkAsRead = async (id: string) => {
        await markAsRead(id);
        const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
        setNotifications(updated);
        setUnreadCount(updated.filter(n => !n.read).length);
        router.refresh();
    };

    const handleClearAll = async () => {
        await clearAllNotifications();
        fetchNotifications();
        router.refresh();
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-400 hover:text-white transition-colors"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-gray-900 animate-pulse" />
                )}
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-80 bg-[#1e293b] border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
                        <div className="p-3 border-b border-gray-700 flex justify-between items-center">
                            <h3 className="font-semibold text-sm text-gray-200">Notificaciones</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleClearAll}
                                    className="text-xs text-indigo-400 hover:text-indigo-300"
                                >
                                    Marcar todas leídas
                                </button>
                            )}
                        </div>

                        <div className="max-h-96 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-4 text-center text-gray-500 text-sm">
                                    No tienes notificaciones.
                                </div>
                            ) : (
                                notifications.map((notif) => (
                                    <div
                                        key={notif.id}
                                        className={`p-3 border-b border-gray-700/50 hover:bg-gray-800 transition-colors ${notif.read ? 'opacity-60' : 'bg-gray-800/30'}`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${notif.type === 'ALERT' ? 'bg-red-900/50 text-red-200' :
                                                    notif.type === 'WARNING' ? 'bg-orange-900/50 text-orange-200' :
                                                        'bg-blue-900/50 text-blue-200'
                                                }`}>
                                                {notif.type}
                                            </span>
                                            <span className="text-[10px] text-gray-500">
                                                {new Date(notif.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h4 className="text-sm font-medium text-gray-200 mb-1">{notif.title}</h4>
                                        <p className="text-xs text-gray-400 mb-2">{notif.message}</p>

                                        <div className="flex justify-end gap-2">
                                            {notif.link && (
                                                <Link
                                                    href={notif.link}
                                                    className="text-xs text-indigo-400 hover:text-indigo-300"
                                                    onClick={() => setIsOpen(false)}
                                                >
                                                    Ver detalles
                                                </Link>
                                            )}
                                            {!notif.read && (
                                                <button
                                                    onClick={() => handleMarkAsRead(notif.id)}
                                                    className="text-gray-500 hover:text-green-400"
                                                    title="Marcar como leída"
                                                >
                                                    <Check size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
