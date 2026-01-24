export interface Client {
    id: string;
    name: string;
    email: string;
    phone: string;
    imageUrl?: string;
    status: 'Activo' | 'Inactivo' | 'En Espera';
    debt: number; // Deuda en moneda local
    lastActivity: string;
    caseCount: number;
}

export const MOCK_CLIENTS: Client[] = [
    {
        id: '1',
        name: 'Roberto Gómez',
        email: 'roberto@email.com',
        phone: '+54 9 11 1234-5678',
        status: 'Activo',
        debt: 150000,
        lastActivity: 'Hoy, 09:30',
        caseCount: 2
    },
    {
        id: '2',
        name: 'María Fernández',
        email: 'maria.fer@email.com',
        phone: '+54 9 11 8765-4321',
        status: 'Activo',
        debt: 0,
        lastActivity: 'Ayer',
        caseCount: 1
    },
    {
        id: '3',
        name: 'Tech Solutions S.A.',
        email: 'contacto@techsol.com',
        phone: '+54 11 4444-5555',
        status: 'En Espera',
        debt: 500000,
        lastActivity: 'Hace 3 días',
        caseCount: 5
    },
];
