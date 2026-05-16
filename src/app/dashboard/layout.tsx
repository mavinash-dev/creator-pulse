import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top navigation bar */}
      <nav className="border-b border-border bg-surface px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-accent" />
          <span className="font-semibold text-foreground">CreatorPulse</span>
        </div>
        {/* TODO: Add UserButton from Clerk, nav links */}
        <div className="h-8 w-8 rounded-full bg-border animate-pulse" />
      </nav>

      {/* Main content */}
      <main className="px-6 py-8 max-w-7xl mx-auto">{children}</main>
    </div>
  )
}
