import { UserRole, VerificationStatus } from "@prisma/client"
import NextAuth, { type DefaultSession } from "next-auth"

export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole
  verificationStatus: VerificationStatus
  isVerified: boolean
  createdAt: Date
}

declare module "next-auth" {
  interface Session {
    user: ExtendedUser
  }
}
