// Crea y comparte una sola conexión (cliente) a la base de datos. Nos sirve para toda la app.

import { PrismaClient } from "@prisma/client";


// TypeScript: en el objeto global puede existir un prisma.
const globalForPrisma = global as unknown as {
    prisma: PrismaClient | undefined
}

/* 
    Si ya hay una conexión guardada, la utilizamos.
    Si no hay una conexión guardada, creamos una nueva.

*/
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
    // log: ['query', 'error', 'warm']
})


// En desarrollo guardamos el cliente en global para reusarlo
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
}