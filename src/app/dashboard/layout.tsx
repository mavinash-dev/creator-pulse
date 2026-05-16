import { auth } from '@clerk/nextjs/server'
import { UserButton } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const NAV_LINKS = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    href: '/dashboard/media-kit',
    label: 'Media Kit',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    href: '/dashboard/alerts',
    label: 'Alerts',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
  },
  {
    href: '/dashboard/settings',
    label: 'Settings',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
]

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
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
      {/* Top navigation bar */}
      <nav className="sticky top-0 z-30 border-b border-[#262626] bg-[#141414] px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
          <div className="h-6 w-6 rounded-full bg-[#3B82F6] flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
            </svg>
          </div>
          <span className="font-semibold text-sm text-[#FAFAFA] tracking-tight">CreatorPulse</span>
        </Link>

        {/* Desktop nav links (hidden on mobile) */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#737373] hover:text-[#FAFAFA] hover:bg-[#262626] rounded-md transition-colors"
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side: user button */}
        <div className="flex items-center gap-3">
          <UserButton
            appearance={{
              elements: {
                avatarBox: 'h-7 w-7',
              },
            }}
          />
        </div>
      </nav>

      {/* Body: sidebar (md+) + main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (desktop only) */}
        <aside className="hidden md:flex flex-col w-52 shrink-0 border-r border-[#262626] bg-[#141414] py-4 px-3">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2.5 px-3 py-2 text-sm text-[#737373] hover:text-[#FAFAFA] hover:bg-[#262626] rounded-md transition-colors"
              >
                <span className="shrink-0">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="px-4 sm:px-6 py-6 max-w-6xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden sticky bottom-0 z-30 border-t border-[#262626] bg-[#141414] flex items-center justify-around px-2 py-2">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex flex-col items-center gap-1 px-3 py-1 text-[#737373] hover:text-[#FAFAFA] transition-colors"
          >
            <span>{link.icon}</span>
            <span className="text-[10px]">{link.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}
