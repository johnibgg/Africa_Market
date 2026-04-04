import { PrismaClient } from "@prisma/client"

const prismaClientSingleton = () => {
    // Provide a fallback URL during build to satisfy Prisma's non-empty datasource check
    const url = process.env.DATABASE_URL || "postgresql://dummy:dummy@localhost:5432/db"
    
    return new PrismaClient({
        datasourceUrl: url,
    } as any)
}

declare global {
    var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma
