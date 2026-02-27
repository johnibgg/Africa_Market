import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import pg from "pg"

const prismaClientSingleton = () => {
    // Dans Prisma 7, si l'URL n'est plus dans le schema.prisma, 
    // on DOIT utiliser un adaptateur ou passer l'URL ici.
    const connectionString = process.env.DATABASE_URL || "postgresql://not-set:not-set@localhost:5432/db"

    const pool = new pg.Pool({ connectionString })
    const adapter = new PrismaPg(pool)

    return new PrismaClient({ adapter })
}

declare global {
    var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma
