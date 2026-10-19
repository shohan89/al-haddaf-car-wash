import NextAuth from "next-auth"
import { NextResponse, type NextRequest } from "next/server"
import { authConfig } from "./auth.config"

const { auth } = NextAuth(authConfig)

// www is live with its own 200s (no redirect), which let Google index either
// host and split ranking signals. Redirect it to the bare domain here,
// ahead of NextAuth — returning this from authConfig's `authorized` callback
// instead gets its hostname stripped back to the request's own origin
// (NextAuth only trusts same-origin redirects there), causing a loop.
export default function middleware(req: NextRequest) {
  if (req.nextUrl.hostname === "www.alhaddafcarwash.com") {
    const canonical = req.nextUrl.clone()
    canonical.hostname = "alhaddafcarwash.com"
    return NextResponse.redirect(canonical, 308)
  }
  return (auth as unknown as (req: NextRequest) => ReturnType<typeof NextResponse.next>)(req)
}

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
}
