'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LandingPage() {
  const [handle, setHandle] = useState('')
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const cleaned = handle.replace(/^@/, '').trim()
    if (cleaned) {
      // TODO: Resolve handle → creator page or trigger onboarding flow
      router.push(`/${cleaned}`)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-background">
      {/* Logo / wordmark */}
      <div className="mb-10 flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-accent" />
        <span className="text-xl font-semibold tracking-tight text-foreground">
          CreatorPulse
        </span>
      </div>

      {/* Hero */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center text-foreground leading-tight max-w-3xl">
        Know your numbers.{' '}
        <span className="text-accent">Know your worth.</span>
      </h1>

      <p className="mt-6 text-lg text-muted text-center max-w-xl">
        Observability for Indian creators — track engagement, benchmark brand
        deal rates, and get alerts before your audience notices anything.
      </p>

      {/* CTA */}
      <form
        onSubmit={handleSubmit}
        className="mt-12 flex flex-col sm:flex-row gap-3 w-full max-w-md"
      >
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted select-none">
            @
          </span>
          <input
            type="text"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            placeholder="yourhandle"
            className="w-full bg-surface border border-border rounded-lg pl-8 pr-4 py-3 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent transition"
          />
        </div>
        <button
          type="submit"
          className="bg-accent hover:bg-blue-500 text-white font-medium rounded-lg px-6 py-3 transition whitespace-nowrap"
        >
          See your dashboard →
        </button>
      </form>

      {/* Social proof placeholder */}
      <p className="mt-8 text-sm text-muted">
        Trusted by creators with 1K–10M followers.{' '}
        <span className="text-foreground">Free during beta.</span>
      </p>

      {/* Feature pills */}
      <div className="mt-16 flex flex-wrap gap-3 justify-center">
        {[
          'Engagement tracking',
          'Follower growth alerts',
          'INR rate benchmarks',
          'Public media kit',
          'Instagram & YouTube',
        ].map((feature) => (
          <span
            key={feature}
            className="px-4 py-2 bg-surface border border-border rounded-full text-sm text-muted"
          >
            {feature}
          </span>
        ))}
      </div>
    </main>
  )
}
