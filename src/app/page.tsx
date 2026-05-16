'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const FEATURE_PILLS = [
  { icon: '📊', label: 'Real-time dashboard' },
  { icon: '🔔', label: 'Smart alerts' },
  { icon: '🔗', label: 'Live media kit' },
]

export default function LandingPage() {
  const [handle, setHandle] = useState('')
  const router = useRouter()

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    const cleaned = handle.replace(/^@/, '').trim()
    if (cleaned) {
      router.push(`/dashboard?handle=${encodeURIComponent(cleaned)}`)
    }
  }

  return (
    <main className="min-h-screen flex flex-col bg-[#0A0A0A]">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 sm:px-10 py-4 border-b border-[#262626]">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-[#3B82F6] flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
            </svg>
          </div>
          <span className="text-sm font-semibold text-[#FAFAFA] tracking-tight">CreatorPulse</span>
        </div>
        <Link
          href="/dashboard"
          className="text-sm font-medium bg-[#3B82F6] hover:bg-blue-500 text-white rounded-lg px-3 py-1.5 transition-colors"
        >
          Open dashboard →
        </Link>
      </nav>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 text-center py-20">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-[#141414] border border-[#262626] rounded-full px-3 py-1 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
          <span className="text-xs text-[#737373]">Built for Indian creators. India-first pricing.</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#FAFAFA] leading-tight tracking-tight max-w-4xl">
          Know your numbers.{' '}
          <span className="text-[#3B82F6]">Know your worth.</span>
        </h1>

        {/* Subheadline */}
        <p className="mt-6 text-base sm:text-lg text-[#737373] max-w-xl leading-relaxed">
          The observability platform built for creators. Not brands.
        </p>

        {/* Handle input form */}
        <form
          onSubmit={handleSubmit}
          className="mt-10 flex flex-col sm:flex-row gap-2 w-full max-w-md"
        >
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737373] select-none text-sm">
              @
            </span>
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="Enter your Instagram handle"
              className="w-full bg-[#141414] border border-[#262626] hover:border-[#3B82F6]/40 focus:border-[#3B82F6] rounded-lg pl-8 pr-4 py-3 text-sm text-[#FAFAFA] placeholder:text-[#737373] focus:outline-none transition-colors"
            />
          </div>
          <button
            type="submit"
            className="bg-[#3B82F6] hover:bg-blue-500 text-white text-sm font-medium rounded-lg px-5 py-3 transition-colors whitespace-nowrap"
          >
            See your dashboard →
          </button>
        </form>

        {/* Feature pills */}
        <div className="mt-8 flex flex-wrap gap-2 justify-center">
          {FEATURE_PILLS.map(({ icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#141414] border border-[#262626] rounded-full text-sm text-[#737373]"
            >
              <span>{icon}</span>
              {label}
            </span>
          ))}
        </div>

        {/* Social proof */}
        <p className="mt-10 text-sm text-[#737373]">
          Built for Indian creators.{' '}
          <span className="text-[#FAFAFA]">India-first pricing.</span>
        </p>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#262626] px-6 py-4 flex items-center justify-between">
        <span className="text-xs text-[#737373]">
          © 2025 CreatorPulse
        </span>
        <span className="text-xs text-[#737373]">
          Free during beta
        </span>
      </footer>
    </main>
  )
}
