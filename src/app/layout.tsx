import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { FloatingAssistant } from "@/components/ai/FloatingAssistant";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Osirius Lex - Estudio Jurídico",
  description: "Sistema de gestión integral para estudios jurídicos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <div className="flex min-h-screen pb-24 md:pb-0">
          <Sidebar />
          <MobileNav />
          <main className="flex-1 p-4 md:p-8 overflow-auto w-full relative">
            {children}
          </main>
        </div>
        <FloatingAssistant />
      </body>
    </html>
  );
}
