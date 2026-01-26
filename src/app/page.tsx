import { Suspense } from "react";
import { getDashboardStats, getTodayEvents } from "@/actions/dashboard-actions";
import { getFinancialStats } from "@/actions/finance-actions";
import { ExpensesWidget } from "@/components/dashboard/ExpensesWidget";
import { DollarSign, Users, Briefcase, Calendar as CalendarIcon, ArrowUpRight, ArrowDownRight, Plus } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const stats = await getDashboardStats();
  const todayEvents = await getTodayEvents();
  const finance = await getFinancialStats();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-lime-400 to-emerald-500">
            Hola, Cuervo
          </h1>
          <p className="text-gray-400">Resumen de actividad y estado financiero.</p>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-sm text-gray-400">{new Date().toLocaleDateString('es-BO', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Clientes Activos</p>
            <h3 className="text-2xl font-bold text-white">{stats.clients}</h3>
          </div>
          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
            <Users size={24} />
          </div>
        </div>
        <div className="glass-card p-4 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Casos en Trámite</p>
            <h3 className="text-2xl font-bold text-white">{stats.cases}</h3>
          </div>
          <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
            <Briefcase size={24} />
          </div>
        </div>

        {/* Finance Card spanning 2 cols */}
        <div className="glass-card p-4 col-span-1 md:col-span-2 bg-gradient-to-br from-[#1a1a20] to-[#121215]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm flex items-center gap-1">
                Flujo de Caja (Neto)
                {finance.netProfit >= 0 ? <ArrowUpRight size={14} className="text-emerald-500" /> : <ArrowDownRight size={14} className="text-red-500" />}
              </p>
              <h3 className={`text-3xl font-bold ${finance.netProfit >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                Bs. {finance.netProfit.toLocaleString()}
              </h3>
            </div>
            <div className="text-right space-y-1">
              <div className="text-xs text-gray-500">Ingresos: <span className="text-gray-300">Bs. {finance.totalIncome.toLocaleString()}</span></div>
              <div className="text-xs text-gray-500">Egresos: <span className="text-gray-300">Bs. {finance.totalExpenses.toLocaleString()}</span></div>

              <div className="text-[10px] text-gray-600 mt-2 pt-2 border-t border-gray-800">
                Est. Impuestos: <span className="text-orange-400">Bs. {finance.taxEstimate.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Agenda */}
          <div className="glass-card p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <CalendarIcon size={20} className="text-lime-400" />
                Agenda de Hoy
              </h3>
              <Link href="/agenda" className="text-xs text-lime-400 hover:text-white transition-colors">Ver todo</Link>
            </div>
            <div className="space-y-3">
              {todayEvents.length > 0 ? todayEvents.map((event: any) => (
                <div key={event.id} className="flex items-center gap-4 p-3 rounded-xl bg-[#25252d] border border-gray-800 hover:border-lime-500/30 transition-colors">
                  <div className="w-2 h-12 bg-lime-500 rounded-full"></div>
                  <div className="flex-1">
                    <h4 className="font-bold text-white text-sm">{event.title}</h4>
                    <p className="text-xs text-gray-400">{new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {event.client?.name || "Sin cliente"}</p>
                  </div>
                  <span className="px-2 py-1 bg-lime-500/10 text-lime-400 text-xs rounded font-bold uppercase">{event.type}</span>
                </div>
              )) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No tienes eventos programados para hoy.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar (1 col) */}
        <div className="space-y-6">
          {/* Quick Expense Widget (NEW) */}
          <ExpensesWidget />

          {/* Quick Actions */}
          <div className="glass-card p-6 flex flex-col items-center text-center gap-4">
            <div className="w-12 h-12 rounded-full bg-lime-500/20 flex items-center justify-center text-lime-400">
              <Plus size={24} />
            </div>
            <div>
              <h3 className="font-bold text-white">Acciones Rápidas</h3>
              <p className="text-xs text-gray-400">Accesos directos a tareas comunes</p>
            </div>
            <div className="grid grid-cols-2 gap-2 w-full">
              <Link href="/clientes" className="p-2 rounded bg-[#25252d] text-xs text-gray-300 hover:text-white hover:bg-gray-700 transition-colors">
                + Cliente
              </Link>
              <Link href="/agenda" className="p-2 rounded bg-[#25252d] text-xs text-gray-300 hover:text-white hover:bg-gray-700 transition-colors">
                + Audiencia
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
