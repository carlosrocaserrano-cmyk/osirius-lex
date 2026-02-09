"use client";


import { ClientCard } from "@/components/clients/ClientCard";
import { Modal } from "@/components/ui/Modal";
import { NewClientForm } from "@/components/clients/NewClientForm";
import SearchInput from "@/components/ui/SearchInput";
import { Filter, UserPlus } from "lucide-react";
import { useState, useEffect } from "react";
import { Client } from "@/types/client";
import { createClient } from "@/actions/client-actions";

interface ClientListProps {
    initialClients: (Client & { lastActivity?: string })[]; // Allow optional lastActivity
}

export function ClientList({ initialClients }: ClientListProps) {
    const [clients, setClients] = useState<(Client & { lastActivity?: string })[]>(initialClients);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setClients(initialClients);
    }, [initialClients]);


    const handleNewClient = async (newClientData: any) => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("name", newClientData.name);
            if (newClientData.email) formData.append("email", newClientData.email);

            // Handle Multiple Phones
            const phones = newClientData.phones || [];
            if (phones.length > 0) {
                formData.append("phone", phones[0]); // Primary
                if (phones.length > 1) {
                    const metadata = { additionalPhones: phones.slice(1) };
                    formData.append("metadata", JSON.stringify(metadata));
                }
            }

            // New Fields
            if (newClientData.identityDoc) formData.append("identityDoc", newClientData.identityDoc);
            if (newClientData.address) formData.append("address", newClientData.address);
            if (newClientData.representative) formData.append("representative", newClientData.representative);
            formData.append("wantsInvoice", String(newClientData.wantsInvoice));

            if (newClientData.photo) {
                formData.append("photo", newClientData.photo);
            }

            await createClient(formData);

            // Server action revalidates path, so we just close modal
            setIsModalOpen(false);
        } catch (error) {
            console.error("Failed to create client", error);
            alert("Error al crear cliente.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header & Controls */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">Clientes</h1>
                    <p className="text-gray-400">Gestiona tu cartera de clientes y sus estados.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-lime-500 hover:bg-lime-400 text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-lg shadow-lime-500/20"
                >
                    <UserPlus size={18} />
                    Nuevo Cliente
                </button>
            </div>

            {/* Search Bar */}
            <div className="flex gap-4 mb-6">
                <SearchInput placeholder="Buscar por nombre, email..." />
                <button className="px-4 bg-[#16161a] border border-gray-800 rounded-xl text-gray-400 hover:text-white hover:border-lime-500/30 transition-colors">
                    <Filter size={20} />
                </button>
            </div>

            {/* Clients Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-10 pr-2">
                {clients.map(client => (
                    <ClientCard key={client.id} client={client} />
                ))}
            </div>

            {/* Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Agregar Nuevo Cliente">
                {isSubmitting ? (
                    <div className="text-center py-10 text-lime-400">Creando cliente y generando contrato...</div>
                ) : (
                    <NewClientForm onSubmit={handleNewClient} onCancel={() => setIsModalOpen(false)} />
                )}
            </Modal>
        </div>
    );
}
