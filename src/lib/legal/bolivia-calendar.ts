
// Basic Bolivian Holidays (Fixed Dates)
const FIXED_HOLIDAYS = [
    "01-01", // Año Nuevo
    "01-22", // Día del Estado Plurinacional
    "05-01", // Día del Trabajo
    "06-21", // Año Nuevo Aymara
    "08-06", // Día de la Independencia
    "11-02", // Todos Santos
    "12-25", // Navidad
];

// Regional Holidays (Santa Cruz)
const REGIONAL_HOLIDAYS_SCZ = [
    "09-24", // Efeméride Santa Cruz
];

/**
 * Checks if a given date is a business day in Bolivia (specifically Santa Cruz rules).
 * Excludes weekends (Sat/Sun) and fixed holidays.
 */
export function isBusinessDay(date: Date): boolean {
    const day = date.getDay();
    // 0 = Sunday, 6 = Saturday
    if (day === 0 || day === 6) {
        return false;
    }

    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    const dateString = `${month}-${d}`;

    if (FIXED_HOLIDAYS.includes(dateString)) return false;
    if (REGIONAL_HOLIDAYS_SCZ.includes(dateString)) return false;

    // TODO: Add moveable holidays (Carnival, Corpus Christi) logic here
    return true;
}

/**
 * Adds business days to a start date.
 * Used for calculating procedural deadlines (plazos procesales).
 */
export function addBusinessDays(startDate: Date, daysToAdd: number): Date {
    let count = 0;
    let currentDate = new Date(startDate);

    // If starting on non-business day, move to next business day first? 
    // Usually deadlines start counting "from the next day of notification".
    // We assume startDate is the notification date, so we start counting from the next day.

    currentDate.setDate(currentDate.getDate() + 1);

    while (count < daysToAdd) {
        if (isBusinessDay(currentDate)) {
            count++;
        }
        if (count < daysToAdd) {
            currentDate.setDate(currentDate.getDate() + 1);
        }
    }

    return currentDate;
}

/**
 * Returns standard procedural deadlines (in business days) per Ley 439 (CPC).
 */
export function getProceduralDeadline(type: 'Apelación' | 'Casación' | 'Contestación' | 'Excepciones'): number {
    switch (type) {
        case 'Apelación': return 10; // Ord.
        case 'Casación': return 10;
        case 'Contestación': return 15; // Ord.
        case 'Excepciones': return 5;
        default: return 3; // Generic
    }
}
