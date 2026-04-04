import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma"
import authConfig from "./auth.config"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

import { generateTwoFactorToken } from "@/lib/tokens"
import { sendTwoFactorTokenEmail } from "@/lib/mail"

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
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id
                token.role = (user as any).role
                token.verificationStatus = (user as any).verificationStatus
                token.isVerified = (user as any).isVerified
                token.createdAt = (user as any).createdAt
            }

            // Optional Sync with DB (only for updates or if sub changed)
            if (token.sub && !user) {
                const existingUser = await prisma.user.findUnique({
                    where: { id: token.sub }
                })

                if (existingUser) {
                    token.role = existingUser.role
                    token.verificationStatus = existingUser.verificationStatus
                    token.isVerified = existingUser.isVerified
                    token.createdAt = existingUser.createdAt
                }
            }

            return token
        },
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub
            }

            if (token.role && session.user) {
                session.user.role = token.role as any
            }

            if (session.user) {
                session.user.verificationStatus = token.verificationStatus as any
                session.user.isVerified = token.isVerified as boolean
                session.user.createdAt = token.createdAt as any
            }

            return session
        },
    },
    providers: [
        Credentials({
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string },
                    include: { twoFactorConfirmation: true }
                })

                if (!user || !user.password) return null

                const isPasswordCorrect = await bcrypt.compare(
                    credentials.password as string,
                    user.password
                )

                if (!isPasswordCorrect) return null

                // 2FA Logic
                if (user.twoFactorEnabled) {
                    const code = credentials.code as string

                    if (code) {
                        const twoFactorToken = await prisma.twoFactorToken.findFirst({
                            where: { email: user.email as string }
                        })

                        if (!twoFactorToken || twoFactorToken.token !== code) {
                            return null // Invalid OTP
                        }

                        const hasExpired = new Date(twoFactorToken.expires) < new Date()
                        if (hasExpired) {
                            return null // Expired OTP
                        }

                        await prisma.twoFactorToken.delete({
                            where: { id: twoFactorToken.id }
                        })

                        const existingConfirmation = await prisma.twoFactorConfirmation.findUnique({
                            where: { userId: user.id }
                        })

                        if (existingConfirmation) {
                            await prisma.twoFactorConfirmation.delete({
                                where: { id: existingConfirmation.id }
                            })
                        }

                        await prisma.twoFactorConfirmation.create({
                            data: { userId: user.id }
                        })
                    } else {
                        // Generate and send OTP if no code provided
                        const twoFactorToken = await generateTwoFactorToken(user.email as string)
                        await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token)
                        
                        // We throw a specific error that the frontend can catch
                        throw new Error("2FA_REQUIRED")
                    }
                }

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
