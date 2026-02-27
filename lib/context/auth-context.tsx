"use client"

import { createContext, useContext, useCallback, type ReactNode } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import type { User, UserRole } from "@/lib/types"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: any) => Promise<void>
  logout: () => void
  switchRole?: (role: UserRole) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const user = session?.user as User | null
  const isLoading = status === "loading"

  const login = useCallback(async (credentials: any) => {
    const result = await signIn("credentials", {
      ...credentials,
      redirect: false,
    })

    if (result?.error) {
      throw new Error(result.error)
    }
  }, [])

  const logout = useCallback(() => {
    signOut({ callbackUrl: "/" })
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}
