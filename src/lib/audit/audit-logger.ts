
import { prisma } from "@/lib/prisma";

export enum AuditAction {
    CREATE = "CREATE",
    UPDATE = "UPDATE",
    DELETE = "DELETE",
    LOGIN = "LOGIN",
    VIEW = "VIEW"
}

/**
 * Logs a critical system activity to the immutable ledger.
 */
export async function logActivity(
    action: AuditAction | string,
    entity: string,
    entityId: string,
    details: string,
    user: string = "System"
) {
    try {
        await prisma.auditLog.create({
            data: {
                action: action.toString(),
                entity,
                entityId,
                details,
                user,
                timestamp: new Date()
            }
        });
    } catch (error) {
        // Fallback: don't break the main app flow if logging fails, but warn console
        console.error("AUDIT LOG FAILURE:", error);
    }
}
