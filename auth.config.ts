import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"

// Ce fichier est importé par le middleware (Edge Runtime).
// Pour rester sous la limite de 1Mo de Vercel, on retire les imports lourds (prisma, bcrypt).
export default {
    providers: [
        Credentials({
            // On laisse la structure, mais la logique réelle sera dans auth.ts
            async authorize() {
                return null
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
