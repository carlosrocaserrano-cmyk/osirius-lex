import { prisma } from "@/lib/prisma";
import { getSettings } from "@/actions/settings-actions";
import CaseDetailsPage from "@/components/cases/CaseDetailsPage";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const caseData = await prisma.case.findUnique({
        where: { id },
        include: {
            client: true,
            updates: {
                orderBy: { date: 'desc' }
            }
        }
    });

    const userSettings = await getSettings();

    if (!caseData) {
        return <div className="text-white text-center py-20">Expediente no encontrado.</div>;
    }

    // Convert dates to strings/serializable format for Client Component if needed (Next.js 15+ sometimes strict)
    // Prisma usually returns Dates object which are fine in server components but strict serialization might be needed across boundary.
    // For now passing directly.

    return <CaseDetailsPage caseData={caseData} userSettings={userSettings} />;
}
