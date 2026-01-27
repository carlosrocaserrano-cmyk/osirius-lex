"use client";

import { useState } from "react";
import { ArrowLeft, Gavel, DollarSign, Download, CheckCircle2, FileCheck, FileX, Trash2, Edit, FileText } from "lucide-react";
import Link from "next/link";
import { AddCaseModal } from "./modals/AddCaseModal";
import { AddPaymentModal } from "./modals/AddPaymentModal";
import { AddDocumentModal } from "./modals/AddDocumentModal";
import { AddPaymentPlanModal } from "./modals/AddPaymentPlanModal";
import { EditClientModal } from "./modals/EditClientModal";
import { EditCaseModal } from "../cases/modals/EditCaseModal";
import { EditPaymentPlanModal } from "./modals/EditPaymentPlanModal";
import { deleteCase, deletePayment, deleteDocument } from "@/actions/client-actions";
import { DynamicFieldEditor } from "./DynamicFieldEditor";
import GenerateDocumentModal from "../documents/GenerateDocumentModal";
import ExpenseTable from "../finances/ExpenseTable";
import { updateClient } from "@/actions/client-actions";

export function ClientDetails({ client, templates = [] }: { client: any, templates?: any[] }) {
    const [activeTab, setActiveTab] = useState<'cases' | 'finance' | 'docs' | 'profile'>('cases');
    const [isAddCaseOpen, setIsAddCaseOpen] = useState(false);
    const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
    const [isAddPaymentPlanOpen, setIsAddPaymentPlanOpen] = useState(false);
    const [isAddDocumentOpen, setIsAddDocumentOpen] = useState(false);
    const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
    const [isGenerateOpen, setIsGenerateOpen] = useState(false);
    const [documentType, setDocumentType] = useState<'received' | 'returned'>('received');

    // Edit States
    const [isEditClientOpen, setIsEditClientOpen] = useState(false);
    const [isEditCaseOpen, setIsEditCaseOpen] = useState(false);
    const [isEditPaymentPlanOpen, setIsEditPaymentPlanOpen] = useState(false);
    const [selectedCase, setSelectedCase] = useState<any>(null);
    const [selectedPlan, setSelectedPlan] = useState<any>(null);

    const handleEditCase = (caseData: any) => {
        setSelectedCase(caseData);
        setIsEditCaseOpen(true);
    };

    const handleEditPlan = (plan: any) => {
        setSelectedPlan(plan);
        setIsEditPaymentPlanOpen(true);
    };

    const openDocumentModal = (type: 'received' | 'returned') => {
        setDocumentType(type);
        setIsAddDocumentOpen(true);
    };

    const handleDeleteCase = async (id: string) => {
        if (confirm("¿Estás seguro de eliminar este proceso?")) {
            await deleteCase(id, client.id);
        }
    };

    const handleDeletePayment = async (id: string) => {
        if (confirm("¿Estás seguro de eliminar este pago?")) {
            await deletePayment(id, client.id);
        }
    };


    const handleInvoiceToggle = async (checked: boolean) => {
        const formData = new FormData();
        formData.set("name", client.name); // Required
        formData.set("wantsInvoice", String(checked));

        // Preserve other fields
        if (client.email) formData.set("email", client.email);
        if (client.phone) formData.set("phone", client.phone);
        if (client.identityDoc) formData.set("identityDoc", client.identityDoc);
        if (client.address) formData.set("address", client.address);
        if (client.representative) formData.set("representative", client.representative);
        if (client.metadata) formData.set("metadata", client.metadata);
        if (client.status) formData.set("status", client.status);

        await updateClient(client.id, formData);
    };

    const handleDeleteDocument = async (id: string) => {
        if (confirm("¿Estás seguro de eliminar este documento?")) {
            await deleteDocument(id, client.id);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header & Back */}
            <div className="flex items-center gap-4 mb-4">
                <Link href="/clientes" className="p-2 rounded-lg bg-[#25252d] hover:bg-lime-500/20 hover:text-lime-400 text-gray-400 transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold text-white">{client.name}</h1>
                        <button
                            onClick={() => setIsEditClientOpen(true)}
                            className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-500 hover:text-lime-400 transition-colors"
                        >
                            <Edit size={18} />
                        </button>
                    </div>
                    <div className="flex gap-4 text-sm text-gray-400 mt-1">
                        <span>{client.email}</span>
                        <span>•</span>
                        <span>{client.phone}</span>
                        <span>•</span>
                        <span className="text-lime-400 font-medium">{client.status}</span>
                    </div>
                </div>
            </div>

            {/* Tabs Layout */}
            <div className="flex gap-2 border-b border-gray-800 mb-6">
                <button
                    onClick={() => setActiveTab('cases')}
                    className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === 'cases' ? 'border-lime-500 text-lime-400' : 'border-transparent text-gray-400 hover:text-white'}`}
                >
                    Expedientes y Procesos
                </button>
                <button
                    onClick={() => setActiveTab('finance')}
                    className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === 'finance' ? 'border-lime-500 text-lime-400' : 'border-transparent text-gray-400 hover:text-white'}`}
                >
                    Finanzas y Recibos
                </button>
                <button
                    onClick={() => setActiveTab('docs')}
                    className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === 'docs' ? 'border-lime-500 text-lime-400' : 'border-transparent text-gray-400 hover:text-white'}`}
                >
                    Control Documental
                </button>
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === 'profile' ? 'border-lime-500 text-lime-400' : 'border-transparent text-gray-400 hover:text-white'}`}
                >
                    Perfil y Datos
                </button>
            </div>

            {/* CASES SECTION */}
            {activeTab === 'cases' && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Gavel className="text-lime-400" size={24} />
                            Procesos Judiciales
                        </h2>
                        <button
                            onClick={() => setIsAddCaseOpen(true)}
                            className="px-3 py-1.5 bg-[#25252d] hover:bg-lime-900/30 text-lime-400 text-sm font-medium rounded-lg border border-lime-500/30 transition-colors"
                        >
                            + Nuevo Proceso
                        </button>
                    </div>

                    <div className="grid gap-4">
                        {client.cases.map((process: any) => (
                            <div key={process.id} className="glass-card p-6 border-l-4 border-l-lime-500">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="px-2 py-1 bg-lime-500/10 text-lime-400 text-xs rounded font-bold uppercase tracking-wider">
                                        {process.tipo}
                                    </span>
                                    <span className="text-gray-400 text-sm">Juzgado: {process.juzgado}</span>
                                </div>
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-bold text-white">{process.caratula}</h3>
                                    <button onClick={() => handleDeleteCase(process.id)} className="text-gray-600 hover:text-red-400 p-1 transition-colors" title="Eliminar proceso">
                                        <Trash2 size={18} />
                                    </button>
                                    <button onClick={() => handleEditCase(process)} className="text-gray-600 hover:text-lime-400 p-1 transition-colors" title="Editar proceso">
                                        <Edit size={18} />
                                    </button>
                                    <Link href={`/expedientes/${process.id}`} className="text-gray-600 hover:text-blue-400 p-1 transition-colors" title="Ver Historial y Reportes">
                                        <FileText size={18} />
                                    </Link>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 p-4 bg-[#16161a] rounded-xl border border-gray-800">
                                    <div>
                                        <span className="block text-xs text-gray-500 uppercase">{process.isJuridica ? "N° Trámite" : "IANUS"}</span>
                                        <span className="font-mono text-white tracking-wide">{process.isJuridica ? process.tramiteNumber : process.ianus}</span>
                                    </div>
                                    <div>
                                        <span className="block text-xs text-gray-500 uppercase">Expediente</span>
                                        <span className="font-mono text-white tracking-wide">{process.expediente}</span>
                                    </div>
                                    <div className="col-span-2">
                                        <span className="block text-xs text-gray-500 uppercase">Estado Actual</span>
                                        <span className="text-white font-medium">{process.estado}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {client.cases.length === 0 && (
                            <div className="text-gray-500 text-center py-10">No hay casos registrados aún.</div>
                        )}
                    </div>
                </div>
            )}

            {/* FINANCE SECTION */}
            {activeTab === 'finance' && (
                <div className="space-y-6">
                    {/* Agreed Fee Progress */}
                    <div className="glass-card p-6 border-l-4 border-l-blue-500">
                        <div className="flex justify-between items-end mb-2">
                            <div>
                                <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">Honorarios Totales Acordados</h3>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-bold text-white">${(client.totalAgreedFee || 0).toLocaleString()}</span>
                                    <button onClick={() => setIsEditClientOpen(true)} className="text-xs text-blue-400 hover:text-white underline">Editar Monto</button>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-bold text-white">
                                    ${client.payments.filter((p: any) => !p.isExtra).reduce((acc: number, p: any) => acc + p.amount, 0).toLocaleString()}
                                </span>
                                <span className="text-gray-500 text-sm block">Pagado (Normal)</span>
                            </div>
                        </div>

                        {client.totalAgreedFee > 0 && (
                            <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden relative">
                                <div
                                    className="bg-blue-500 h-full transition-all duration-500 ease-out flex items-center justify-center text-[10px] font-bold text-white"
                                    style={{ width: `${Math.min(((client.payments.filter((p: any) => !p.isExtra).reduce((acc: number, p: any) => acc + p.amount, 0)) / client.totalAgreedFee) * 100, 100)}%` }}
                                >
                                    {Math.round(((client.payments.filter((p: any) => !p.isExtra).reduce((acc: number, p: any) => acc + p.amount, 0)) / client.totalAgreedFee) * 100)}%
                                </div>
                            </div>
                        )}

                        {/* Extra Payments Summary */}
                        <div className="mt-4 pt-4 border-t border-gray-700/50 flex justify-between items-center">
                            <span className="text-purple-400 text-sm font-medium flex items-center gap-2">
                                <DollarSign size={14} /> Servicios Extras Facturados
                            </span>
                            <span className="text-white font-bold">
                                + ${client.payments.filter((p: any) => p.isExtra).reduce((acc: number, p: any) => acc + p.amount, 0).toLocaleString()}
                            </span>
                        </div>
                    </div>

                    {/* Invoice Toggle */}
                    <div className="glass-card p-4 flex items-center justify-between border-l-4 border-l-lime-500">
                        <div>
                            <h3 className="font-bold text-white">Facturación</h3>
                            <p className="text-sm text-gray-400">Habilitar si el cliente requiere Factura A / Responsable Inscripto</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                defaultChecked={client.wantsInvoice}
                                onChange={(e) => handleInvoiceToggle(e.target.checked)}
                            />
                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-lime-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-lime-500"></div>
                        </label>
                    </div>

                    <div className="glass-card p-8 flex flex-col items-center justify-center gap-4 text-center border-dashed border-2 border-gray-700 hover:border-lime-500/50 transition-colors group">
                        <div className="w-16 h-16 rounded-full bg-gray-800 group-hover:bg-lime-500/20 flex items-center justify-center transition-colors">
                            <DollarSign size={32} className="text-gray-400 group-hover:text-lime-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Generar Nuevo Recibo</h3>
                            <p className="text-sm text-gray-400">Crea un comprobante de pago profesional en PDF.</p>
                        </div>
                        <button
                            onClick={() => setIsAddPaymentOpen(true)}
                            className="px-6 py-2 bg-lime-500 hover:bg-lime-400 text-black font-bold rounded-lg shadow-lg shadow-lime-500/20 transition-all"
                        >
                            Crear Recibo Ahora
                        </button>
                    </div>

                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold text-white">Planes de Pago Activos</h3>
                        <button onClick={() => setIsAddPaymentPlanOpen(true)} className="text-sm text-lime-400 hover:text-white underline">
                            + Crear Plan
                        </button>
                    </div>

                    <div className="grid gap-3">
                        {client.paymentPlans?.map((plan: any) => (
                            <div key={plan.id} className="p-4 bg-[#1a1a20] rounded-xl border border-gray-800 border-l-4 border-l-lime-500">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="font-bold text-white">{plan.concept}</h4>
                                        <p className="text-xs text-gray-400">Inicio: {plan.startDate} • {plan.frequency}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => handleEditPlan(plan)} className="text-gray-500 hover:text-lime-400 p-1 transition-colors">
                                            <Edit size={14} />
                                        </button>
                                        <span className={`px-2 py-1 text-xs rounded font-bold ${plan.status === 'Activo' ? 'bg-lime-500/10 text-lime-400' : plan.status === 'Cancelado' ? 'bg-red-500/10 text-red-400' : 'bg-gray-500/10 text-gray-400'}`}>{plan.status}</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mt-3">
                                    <div className="text-sm text-gray-300">
                                        <span className="block text-xs text-gray-500">Monto Total</span>
                                        ${plan.totalAmount.toLocaleString()}
                                    </div>
                                    <div className="text-sm text-gray-300 text-right">
                                        <span className="block text-xs text-gray-500">Cuotas</span>
                                        {plan.installments}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {!client.paymentPlans?.length && (
                            <p className="text-gray-500 text-sm italic">No hay planes de pago activos.</p>
                        )}
                    </div>

                    {/* EXPENSE TABLE INTEGRATION */}
                    <ExpenseTable expenses={client.expenses || []} clientId={client.id} />

                    <div>
                        <h3 className="text-lg font-bold text-white mb-4">Historial de Pagos</h3>
                        <div className="space-y-3">
                            {client.payments.map((pay: any) => (
                                <div key={pay.id} className={`flex justify-between items-center p-4 rounded-xl border border-gray-800 ${pay.isExtra ? 'bg-purple-900/10 border-l-4 border-l-purple-500' : 'bg-[#1a1a20]'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-lg ${pay.isExtra ? 'bg-purple-500/20' : 'bg-emerald-500/10'}`}>
                                            <DollarSign className={pay.isExtra ? 'text-purple-400' : 'text-emerald-400'} size={20} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-bold text-white">{pay.concept}</p>
                                                {pay.isExtra && <span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">EXTRA</span>}
                                            </div>
                                            <p className="text-sm text-gray-500">{pay.date}</p>
                                        </div>
                                    </div>
                                    <div className="text-right flex flex-col items-end gap-2">
                                        <div>
                                            <p className="font-bold text-white text-lg">${pay.amount.toLocaleString()}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => window.open(`/recibo/${pay.id}`, '_blank')} className="text-xs text-lime-400 hover:text-white flex items-center gap-1">
                                                <Download size={12} /> Descargar PDF
                                            </button>
                                            <button onClick={() => handleDeletePayment(pay.id)} className="text-gray-600 hover:text-red-400 transition-colors" title="Eliminar pago">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* DOCUMENTS SECTION */}
            {
                activeTab === 'docs' && (
                    <div className="space-y-6">
                        <div className="glass-card p-6 flex items-center justify-between border-dashed border-2 border-gray-700 hover:border-lime-500/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Generar Documento</h3>
                                    <p className="text-sm text-gray-400">Crea contratos o escritos usando tus plantillas.</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsGenerateOpen(true)}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
                            >
                                <Download size={18} />
                                Usar Plantilla
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* RECEIVED */}
                            <div className="glass-card p-6">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 border-b border-gray-800 pb-3">
                                    <FileCheck className="text-lime-400" />
                                    Documentación Recibida
                                </h3>
                                <div className="space-y-3">
                                    {client.documents.received.map((doc: any) => (
                                        <div key={doc.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-800/50 transition-colors">
                                            <CheckCircle2 size={18} className="text-lime-500 mt-1" />
                                            <div>
                                                <p className="text-white text-sm font-medium">{doc.name}</p>
                                                <p className="text-xs text-gray-500">Recibido el {doc.date}</p>
                                            </div>
                                            <button onClick={() => handleDeleteDocument(doc.id)} className="ml-auto text-gray-600 hover:text-red-400 p-1 transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => openDocumentModal('received')}
                                        className="w-full mt-2 py-2 text-sm text-gray-400 hover:text-white border border-dashed border-gray-700 rounded-lg hover:border-gray-500 transition-colors"
                                    >
                                        + Registrar Documento Recibido
                                    </button>
                                </div>
                            </div>

                            {/* RETURNED */}
                            <div className="glass-card p-6">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 border-b border-gray-800 pb-3">
                                    <FileX className="text-orange-400" />
                                    Documentación Devuelta
                                </h3>
                                <div className="space-y-3">
                                    {client.documents.returned.map((doc: any) => (
                                        <div key={doc.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-800/50 transition-colors">
                                            <ArrowLeft size={18} className="text-orange-500 mt-1" />
                                            <div>
                                                <p className="text-white text-sm font-medium">{doc.name}</p>
                                                <p className="text-xs text-gray-500">Devuelto el {doc.date}</p>
                                            </div>
                                            <button onClick={() => handleDeleteDocument(doc.id)} className="ml-auto text-gray-600 hover:text-red-400 p-1 transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => openDocumentModal('returned')}
                                        className="w-full mt-2 py-2 text-sm text-gray-400 hover:text-white border border-dashed border-gray-700 rounded-lg hover:border-gray-500 transition-colors"
                                    >
                                        + Registrar Devolución
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {
                activeTab === 'profile' && (
                    <div className="space-y-6">
                        <div className="bg-[#1e1e24] p-6 rounded-lg border border-gray-800">
                            <h3 className="text-xl font-bold text-white mb-4">Información del Cliente</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-500 text-xs uppercase font-bold mb-1">Nombre Completo</label>
                                    <p className="text-white font-medium">{client.name}</p>
                                </div>
                                <div>
                                    <label className="block text-gray-500 text-xs uppercase font-bold mb-1">Documento (CI/NIT)</label>
                                    <p className="text-white font-medium">{client.identityDoc || "N/A"}</p>
                                </div>
                                <div>
                                    <label className="block text-gray-500 text-xs uppercase font-bold mb-1">Email</label>
                                    <p className="text-white font-medium">{client.email || "N/A"}</p>
                                </div>
                                <div>
                                    <label className="block text-gray-500 text-xs uppercase font-bold mb-1">Teléfono</label>
                                    <p className="text-white font-medium">{client.phone || "N/A"}</p>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-gray-500 text-xs uppercase font-bold mb-1">Dirección</label>
                                    <p className="text-white font-medium">{client.address || "N/A"}</p>
                                </div>
                                {client.representative && (
                                    <div className="md:col-span-2">
                                        <label className="block text-gray-500 text-xs uppercase font-bold mb-1">Representante Legal</label>
                                        <p className="text-white font-medium">{client.representative}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <DynamicFieldEditor clientId={client.id} initialMetadata={client.metadata} />
                    </div>
                )
            }

            {/* MODALS */}
            <AddCaseModal
                isOpen={isAddCaseOpen}
                onClose={() => setIsAddCaseOpen(false)}
                clientId={client.id}
            />
            <AddPaymentModal
                isOpen={isAddPaymentOpen}
                onClose={() => setIsAddPaymentOpen(false)}
                clientId={client.id}
            />
            <AddPaymentPlanModal
                isOpen={isAddPaymentPlanOpen}
                onClose={() => setIsAddPaymentPlanOpen(false)}
                clientId={client.id}
            />
            <AddDocumentModal
                isOpen={isAddDocumentOpen}
                onClose={() => setIsAddDocumentOpen(false)}
                clientId={client.id}
                defaultType={documentType}
            />

            <EditClientModal
                isOpen={isEditClientOpen}
                onClose={() => setIsEditClientOpen(false)}
                client={client}
            />

            {
                selectedCase && (
                    <EditCaseModal
                        isOpen={isEditCaseOpen}
                        onClose={() => setIsEditCaseOpen(false)}
                        clientId={client.id}
                        caseData={selectedCase}
                    />
                )
            }

            {
                selectedPlan && (
                    <EditPaymentPlanModal
                        isOpen={isEditPaymentPlanOpen}
                        onClose={() => setIsEditPaymentPlanOpen(false)}
                        clientId={client.id}
                        plan={selectedPlan}
                    />
                )
            }



            <GenerateDocumentModal
                isOpen={isGenerateOpen}
                onClose={() => setIsGenerateOpen(false)}
                preSelectedClientId={client.id}
                templates={templates}
            // cases={client.cases} // Removed because modal fetches cases internally or we can pass it as pre-fetched logic if we update modal to accept it
            />
        </div >
    );
}
