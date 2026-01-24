"use client";

import { LayoutDashboard, Users, FolderOpen, CreditCard, Calendar } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
    { name: "Resumen", href: "/", icon: LayoutDashboard },
    { name: "Agenda", href: "/agenda", icon: Calendar },
    { name: "Clientes", href: "/clientes", icon: Users },
    //    { name: "Expedientes", href: "/expedientes", icon: FolderOpen }, // Too many items for bottom nav, maybe group or hide? Let's keep 4-5 max.
    { name: "Finanzas", href: "/finanzas", icon: CreditCard },
];

export function MobileNav() {
    const pathname = usePathname();

    return (
        <div className="md:hidden fixed bottom-6 left-4 right-4 h-16 bg-[#16161a]/90 backdrop-blur-md border border-gray-800 rounded-2xl flex items-center justify-around px-2 z-50 shadow-2xl shadow-black/50">
            {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${isActive
                            ? "bg-lime-500 text-black shadow-lg shadow-lime-500/20"
                            : "text-gray-400 hover:text-white"
                            }`}
                    >
                        <item.icon size={20} className={isActive ? "stroke-[2.5]" : ""} />
                        {/* Status dot for active */}
                        {isActive && <div className="absolute -bottom-2 w-1 h-1 bg-lime-500 rounded-full hidden"></div>}
                    </Link>
                );
            })}
        </div>
    );
}
