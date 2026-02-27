import { PrismaClient } from "@prisma/client"

const prismaClientSingleton = () => {
    // During Vercel build (Collecting page data), DATABASE_URL might be missing.
    // Providing a dummy URL prevents the Prisma constructor from throwing an error.
    const url = process.env.DATABASE_URL || "postgresql://not-set:not-set@localhost:5432/db"

    return new PrismaClient({
        datasources: {
            db: { url }
        }
    })
}

declare global {
    var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma
