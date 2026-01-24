import { prisma } from "@/lib/prisma";
export const dynamic = 'force-dynamic';
import { notFound } from "next/navigation";
import { ReceiptView } from "@/components/finance/ReceiptView";

export default async function ReceiptPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const payment = await prisma.payment.findUnique({
        where: { id },
        include: { client: true }
    });

    if (!payment) {
        return notFound();
    }

    return <ReceiptView payment={payment} />;
}
