import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"

export default {
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
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.role = (user as any).role
                token.verificationStatus = (user as any).verificationStatus
                token.isVerified = (user as any).isVerified
            }
            return token
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string
                (session.user as any).role = token.role as string
                (session.user as any).verificationStatus = token.verificationStatus as string
                (session.user as any).isVerified = token.isVerified as boolean
            }
            return session
        },
    },
    pages: {
        signIn: "/auth/login",
    }
} satisfies NextAuthConfig
