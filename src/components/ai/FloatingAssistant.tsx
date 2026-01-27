"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Sparkles, Minus, Maximize2, Minimize2 } from "lucide-react";
import { chatWithAI } from "@/actions/ai-actions";

export function FloatingAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
        { role: 'model', text: 'Hola, soy Osirius. ¿En qué puedo ayudarte con tus casos hoy?' }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsLoading(true);

        // Get current page context (very basic for now)
        const context = {
            url: window.location.pathname,
            title: document.title
        };

        try {
            const response = await chatWithAI(userMsg, context);
            setMessages(prev => [...prev, { role: 'model', text: response }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'model', text: "Lo siento, tuve un problema al pensar. Intenta de nuevo." }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 p-4 bg-lime-500 hover:bg-lime-400 text-black rounded-full shadow-lg shadow-lime-500/20 transition-all hover:scale-110 z-50 group"
            >
                <Sparkles className="animate-pulse" size={24} />
                <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Osirius AI
                </span>
            </button>
        );
    }

    if (isMinimized) {
        return (
            <div className="fixed bottom-6 right-6 w-72 bg-[#1a1a20] border border-gray-700 rounded-t-lg shadow-2xl z-50 flex justify-between items-center p-3 cursor-pointer hover:bg-[#202025]" onClick={() => setIsMinimized(false)}>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-lime-500 animate-pulse"></div>
                    <span className="text-white font-bold text-sm">Osirius AI</span>
                </div>
                <div className="flex gap-2">
                    <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} className="text-gray-400 hover:text-white"><X size={16} /></button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 w-[350px] md:w-[400px] h-[500px] max-h-[80vh] bg-[#1a1a20] border border-gray-700 rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
            {/* Header */}
            <div className="p-4 bg-gray-900/50 border-b border-gray-700 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Sparkles className="text-lime-500" size={18} />
                    <h3 className="font-bold text-white">Osirius AI</h3>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setIsMinimized(true)} className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-white" title="Minimizar">
                        <Minus size={16} />
                    </button>
                    <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-red-500/20 rounded text-gray-400 hover:text-red-400" title="Cerrar">
                        <X size={16} />
                    </button>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#16161a]">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-3 rounded-lg text-sm ${msg.role === 'user'
                                ? 'bg-lime-500/20 text-lime-100 border border-lime-500/30 rounded-br-none'
                                : 'bg-gray-800 text-gray-200 border border-gray-700 rounded-bl-none'
                            }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-800 px-4 py-2 rounded-lg rounded-bl-none flex gap-1">
                            <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></span>
                            <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                            <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-gray-900/50 border-t border-gray-700">
                <div className="relative">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Pregunta algo sobre leyes o casos..."
                        className="w-full bg-[#25252d] border border-gray-700 rounded-lg py-3 pl-4 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-lime-500 transition-colors"
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className="absolute right-2 top-2 p-1.5 bg-lime-500 hover:bg-lime-400 text-black rounded-md disabled:opacity-50 disabled:bg-gray-600 transition-all"
                    >
                        <Send size={16} />
                    </button>
                </div>
                <div className="text-center mt-2">
                    <p className="text-[10px] text-gray-600">Gemini AI puede cometer errores. Verifica la info importante.</p>
                </div>
            </div>
        </div>
    );
}
