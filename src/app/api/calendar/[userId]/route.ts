import { prisma } from "@/lib/prisma";
import { createEvents, EventAttributes } from "ics";
import { NextRequest, NextResponse } from "next/server";

// Using a fixed ID for now since we have a single user system essentially, 
// strictly speaking this should be dynamic or based on the session.
// We will accept any ID but effectively just return all events for the MVP.
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    const { userId } = await params;

    const events = await prisma.event.findMany({
        where: {
            status: { not: "Cancelado" }
        },
        include: {
            client: { select: { name: true } },
            case: { select: { caratula: true } }
        }
    });

    const icsEvents: EventAttributes[] = events.map(e => {
        // Parse date (Prisma stores as DateTime which is UTC usually)
        const date = new Date(e.date);

        return {
            start: [date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes()],
            duration: { hours: 1 }, // Default duration
            title: `[Osirius] ${e.title}`,
            description: `${e.description || ''}\n\nCliente: ${e.client?.name || 'N/A'}\nCaso: ${e.case?.caratula || 'N/A'}`,
            location: 'Osirius Lex',
            status: 'CONFIRMED',
            busyStatus: 'BUSY',
            url: 'https://osirius-lex.vercel.app/agenda',
            uid: e.id, // Stable UID for updates
        };
    });

    return new Promise((resolve) => {
        createEvents(icsEvents, (error, value) => {
            if (error) {
                console.error(error);
                resolve(new NextResponse("Error generating calendar", { status: 500 }));
                return;
            }

            resolve(new NextResponse(value, {
                headers: {
                    'Content-Type': 'text/calendar; charset=utf-8',
                    'Content-Disposition': `attachment; filename="osirius-calendar.ics"`,
                },
            }));
        });
    });
}
