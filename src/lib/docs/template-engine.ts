export function renderTemplate(templateContent: string, data: Record<string, any>): string {
    return templateContent.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        return data[key] !== undefined ? String(data[key]) : match;
    });
}

/**
 * Extracts variable names from a template string e.g. {{name}} -> "name"
 */
export function extractVariables(templateContent: string): string[] {
    const regex = /\{\{(\w+)\}\}/g;
    const matches = new Set<string>();
    let match;
    while ((match = regex.exec(templateContent)) !== null) {
        matches.add(match[1]);
    }
    return Array.from(matches);
}
