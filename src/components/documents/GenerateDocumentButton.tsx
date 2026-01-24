"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import GenerateDocumentModal from "./GenerateDocumentModal";

export default function GenerateDocumentButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
                <Plus size={20} />
                Generar Documento
            </button>
            <GenerateDocumentModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
}
