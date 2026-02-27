import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import pg from "pg"

const prismaClientSingleton = () => {
    // Determine the connection string
    const connectionString = process.env.DATABASE_URL

    // In production (Vercel Build), if connectionString is missing, we use a placeholder 
    // to avoid adapter initialization errors, although it won't be used for real queries.
    if (!connectionString || process.env.NEXT_PHASE === 'phase-production-build') {
        return new PrismaClient()
    }

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
