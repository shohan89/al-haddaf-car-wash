import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnAdmin = nextUrl.pathname.startsWith("/admin")
      const isLogin = nextUrl.pathname === "/admin/login"

      if (isOnAdmin) {
        if (isLoggedIn) {
          if (isLogin) return Response.redirect(new URL("/admin", nextUrl))
          return true
        }
        if (isLogin) return true
        return false // Redirect unauthenticated users to login page
      }
      return true
    },
  },
  providers: [], // Add providers in auth.ts
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 Days
  },
  trustHost: true,
  secret: process.env.AUTH_SECRET,
} satisfies NextAuthConfig
