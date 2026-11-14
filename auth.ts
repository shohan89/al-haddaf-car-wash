import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { authConfig } from "./auth.config"
import prisma from "@/lib/db"
import bcrypt from "bcryptjs"

const MAX_FAILED_ATTEMPTS = 5
const LOCKOUT_MINUTES = 15

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) return null

          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          })

          if (!user || !user.password) return null

          // Account lockout: a brute-forced/guessed password is what let an
          // attacker deface this site through the admin panel on 2026-11-11
          // — there was previously no limit on login attempts at all.
          if (user.lockedUntil && user.lockedUntil.getTime() > Date.now()) {
            return null
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password as string,
            user.password
          )

          if (!isPasswordCorrect) {
            const attempts = user.failedLoginAttempts + 1
            await prisma.user.update({
              where: { id: user.id },
              data: {
                failedLoginAttempts: attempts,
                lockedUntil:
                  attempts >= MAX_FAILED_ATTEMPTS
                    ? new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000)
                    : null,
              },
            })
            return null
          }

          if (user.failedLoginAttempts > 0 || user.lockedUntil) {
            await prisma.user.update({
              where: { id: user.id },
              data: { failedLoginAttempts: 0, lockedUntil: null },
            })
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        } catch (error) {
          console.error("Authentication error during sign-in:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role
      }
      return session
    },
  },
})
