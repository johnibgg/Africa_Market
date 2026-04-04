import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"

// Désactiver la vérification SSL pour éviter l'erreur "self-signed certificate in certificate chain" en local
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const prismaClientSingleton = () => {
    // Nettoyer la chaîne de connexion si elle contient des paramètres conflictuels
    const baseConnectionString = process.env.DATABASE_URL || "postgresql://not-set:not-set@localhost:5432/db"
    
    const pool = new Pool({ 
        connectionString: baseConnectionString,
        ssl: {
            rejectUnauthorized: false
        }
    })
    
    const adapter = new PrismaPg(pool)
    
    // Le client Prisma utilisera l'adaptateur pour toutes les requêtes,
    // évitant ainsi les erreurs de certificat SSL de l'engin Rust natif.
    return new PrismaClient({ adapter })
}

declare global {
    var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma
