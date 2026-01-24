import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const carlos = await prisma.client.upsert({
        where: { id: '1' }, // We use a fixed ID for the demo
        update: {},
        create: {
            id: '1',
            name: 'Carlos Ruiz',
            email: 'carlos@test.com',
            phone: '+54 9 11 0000-0000',
            status: 'Activo',
            cases: {
                create: [
                    {
                        caratula: 'Ruiz, Carlos c/ Consorcio Propietarios s/ Daños y Perjuicios',
                        ianus: '2024-001234',
                        expediente: 'EXP-5521/2024',
                        juzgado: 'Civil y Comercial N° 4',
                        tipo: 'Civil - Daños',
                        estado: 'En trámite - Período Probatorio'
                    },
                    {
                        caratula: 'Ruiz, Carlos s/ Sucesión Ab-Intestato',
                        ianus: '2023-998877',
                        expediente: 'EXP-1102/2023',
                        juzgado: 'Familia N° 2',
                        tipo: 'Sucesión',
                        estado: 'Declaratoria de Herederos'
                    }
                ]
            },
            payments: {
                create: [
                    { concept: 'Honorarios Iniciales', amount: 150000, date: new Date('2024-03-10') },
                    { concept: 'Adelanto Gastos', amount: 50000, date: new Date('2024-03-15') }
                ]
            },
            documents: {
                create: [
                    { name: 'Escritura de Propiedad (Copia Certificada)', type: 'received', date: new Date('2024-03-12') },
                    { name: 'DNI (Fotocopia)', type: 'received', date: new Date('2024-03-12') },
                    { name: 'Carta Documento Correo Argentino', type: 'received', date: new Date('2024-03-15') },
                    { name: 'Escritura Original', type: 'returned', date: new Date('2024-03-20') }
                ]
            }
        }
    })

    console.log({ carlos })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
