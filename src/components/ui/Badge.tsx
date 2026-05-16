type Platform = 'instagram' | 'youtube' | 'tiktok'
type BadgeVariant = 'platform' | 'niche' | 'status' | Platform | 'active' | 'inactive' | 'beta' | 'default'

interface BadgeProps {
  variant?: BadgeVariant
  platform?: Platform
  children: React.ReactNode
  className?: string
}

const platformClasses: Record<Platform, string> = {
  instagram: 'bg-pink-900/40 text-pink-300 border-pink-800',
  youtube: 'bg-red-900/40 text-red-300 border-red-800',
  tiktok: 'bg-cyan-900/40 text-cyan-300 border-cyan-800',
}

function resolveClasses(variant: BadgeVariant, platform?: Platform): string {
  // New variant system
  if (variant === 'platform') {
    if (platform) return platformClasses[platform]
    return 'bg-[#262626] text-[#737373] border-[#262626]'
  }
  if (variant === 'niche') {
    return 'bg-violet-900/40 text-violet-300 border-violet-800'
  }
  if (variant === 'status') {
    return 'bg-[#22C55E]/20 text-[#22C55E] border-[#22C55E]/40'
  }

  // Legacy / convenience variants
  if (variant === 'instagram') return platformClasses.instagram
  if (variant === 'youtube') return platformClasses.youtube
  if (variant === 'tiktok') return platformClasses.tiktok
  if (variant === 'active') return 'bg-green-900/40 text-green-300 border-green-800'
  if (variant === 'inactive') return 'bg-zinc-800 text-[#737373] border-[#262626]'
  if (variant === 'beta') return 'bg-[#3B82F6]/20 text-[#3B82F6] border-[#3B82F6]/40'

  // default
  return 'bg-[#141414] text-[#737373] border-[#262626]'
}

export default function Badge({
  variant = 'default',
  platform,
  children,
  className = '',
}: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full border',
        resolveClasses(variant, platform),
        className,
      ].join(' ')}
    >
      {children}
    </span>
  )
}
