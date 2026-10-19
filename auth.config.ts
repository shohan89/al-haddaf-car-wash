import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      // Canonical host is the bare domain — www is live with its own 200s
      // (no redirect), which lets Google index either, splitting signals.
      if (nextUrl.hostname === "www.alhaddafcarwash.com") {
        const canonical = nextUrl.clone()
        canonical.hostname = "alhaddafcarwash.com"
        return Response.redirect(canonical, 308)
      }

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
