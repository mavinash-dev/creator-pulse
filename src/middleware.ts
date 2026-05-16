import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)'])

// Auth is controlled by NEXT_PUBLIC_SKIP_AUTH in .env.local / Vercel env vars.
// Set NEXT_PUBLIC_SKIP_AUTH=true  → all routes open, no login required (current mode)
// Set NEXT_PUBLIC_SKIP_AUTH=false → /dashboard requires Clerk sign-in (production mode)
export default clerkMiddleware(async (auth, req) => {
  if (process.env.NEXT_PUBLIC_SKIP_AUTH === 'true') return NextResponse.next()
  if (isProtectedRoute(req)) await auth.protect()
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
