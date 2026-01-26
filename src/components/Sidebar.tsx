"use client";

import { LayoutDashboard, Users, FolderOpen, CreditCard, Settings, Calendar } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NotificationsMenu from "./ui/NotificationsMenu";

const navigation = [
    { name: "Resumen", href: "/", icon: LayoutDashboard },
    { name: "Agenda", href: "/agenda", icon: Calendar }, // Added Agenda
    { name: "Clientes", href: "/clientes", icon: Users },
    { name: "Expedientes", href: "/expedientes", icon: FolderOpen },
    { name: "Finanzas", href: "/finanzas", icon: CreditCard },
    { name: "Documentos", href: "/documentos", icon: LayoutDashboard }, // Added Docs
];

import SearchInput from "./ui/SearchInput";
import XPBar from "./gamification/XPBar";

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="hidden md:flex flex-col w-64 h-screen px-4 py-8 bg-[#16161a] border-r border-gray-800 sticky top-0">
            <div className="flex items-center justify-between px-2 mb-6">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-lime-500 flex items-center justify-center">
                        <span className="text-black font-bold text-xl">O</span>
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-lime-400 to-emerald-400">
                        OSIRIUS
                    </span>
                </div>
                <NotificationsMenu />
            </div>

            <div className="mb-6">
                <SearchInput />
            </div>

            <nav className="flex-1 flex flex-col gap-1 overflow-y-auto">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${isActive
                                ? "bg-lime-500/10 text-lime-400 font-medium"
                                : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                }`}
                        >
                            <item.icon
                                size={20}
                                className={isActive ? "text-lime-400" : "text-gray-500 group-hover:text-white transition-colors"}
                            />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto">
                <XPBar />
                <Link
                    href="/settings"
                    className="flex items-center gap-3 px-3 py-3 text-gray-400 hover:text-white transition-colors"
                >
                    <Settings size={20} />
                    <span>Configuración</span>
                </Link>
            </div>
        </div>
    );
}
