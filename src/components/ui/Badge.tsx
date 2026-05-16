type BadgeVariant =
  | 'instagram'
  | 'youtube'
  | 'tiktok'
  | 'active'
  | 'inactive'
  | 'beta'
  | 'default'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  instagram:
    'bg-pink-900/40 text-pink-300 border-pink-800',
  youtube:
    'bg-red-900/40 text-red-300 border-red-800',
  tiktok:
    'bg-cyan-900/40 text-cyan-300 border-cyan-800',
  active:
    'bg-green-900/40 text-green-300 border-green-800',
  inactive:
    'bg-zinc-800 text-muted border-border',
  beta:
    'bg-accent/20 text-accent border-accent/40',
  default:
    'bg-surface text-muted border-border',
}

export default function Badge({
  variant = 'default',
  children,
  className = '',
}: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full border',
        variantClasses[variant],
        className,
      ].join(' ')}
    >
      {children}
    </span>
  )
}
