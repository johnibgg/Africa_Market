import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma"
import authConfig from "./auth.config"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

// Ce fichier ne tourne que côté serveur (Node.js), pas dans le middleware.
// On y injecte la logique lourde (base de données et chiffrement).
export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut
} = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string }
                })

                if (!user || !user.password) return null

                const isPasswordCorrect = await bcrypt.compare(
                    credentials.password as string,
                    user.password
                )

                if (!isPasswordCorrect) return null

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    image: user.image,
                    verificationStatus: user.verificationStatus,
                    isVerified: user.isVerified,
                } as any
            },
        }),
    ],
})
