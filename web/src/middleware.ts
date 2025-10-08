import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const token =
    req.cookies.get("next-auth.session-token") ||
    req.cookies.get("__Secure-next-auth.session-token")

  const url = req.nextUrl.clone()

  if (!token && url.pathname.startsWith("/dashboard")) {
    url.pathname = "/signin"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

// Defina quais rotas o middleware deve aplicar
export const config = {
  matcher: ["/dashboard/:path*"],
}
