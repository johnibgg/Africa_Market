import { crypto } from "next/dist/compiled/@edge-runtime/primitives"
import prisma from "@/lib/prisma"

export const generateTwoFactorToken = async (email: string) => {
    // Generate a 6-digit random code
    const token = Math.floor(100000 + Math.random() * 900000).toString()
    const expires = new Date(new Date().getTime() + 10 * 60 * 1000) // 10 minutes

    const existingToken = await prisma.twoFactorToken.findFirst({
        where: { email }
    })

    if (existingToken) {
        await prisma.twoFactorToken.delete({
            where: { id: existingToken.id }
        })
    }

    const twoFactorToken = await prisma.twoFactorToken.create({
        data: {
            email,
            token,
            expires
        }
    })

    return twoFactorToken
}
