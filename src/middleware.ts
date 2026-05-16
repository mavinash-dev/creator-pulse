import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// DEV: plain pass-through — no Clerk key needed, all routes open
// PROD: swap back to clerkMiddleware (see comment below) once Clerk keys are in .env
export function middleware(_req: NextRequest) {
  return NextResponse.next()
}

/*
 * PRODUCTION version — replace the above with this once CLERK_SECRET_KEY is set:
 *
 * import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
 * const isProtectedRoute = createRouteMatcher(['/dashboard(.*)'])
 * export default clerkMiddleware(async (auth, req) => {
 *   if (isProtectedRoute(req)) await auth.protect()
 * })
 */

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
