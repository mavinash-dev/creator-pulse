import Link from 'next/link'
import MediaKitCard from '@/components/mediakit/MediaKitCard'
import RateCard from '@/components/mediakit/RateCard'

interface PageProps {
  params: Promise<{ handle: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { handle } = await params
  return {
    title: `@${handle} — CreatorPulse Media Kit`,
    description: `View ${handle}'s public media kit, engagement stats, and brand deal rates.`,
  }
}

export default async function PublicMediaKitPage({ params }: PageProps) {
  const { handle } = await params

  // TODO: Fetch creator data from Supabase using the handle
  // const creator = await getCreatorByHandle(handle)
  // if (!creator || !creator.mediaKit?.is_public) notFound()

  return (
    <main className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <MediaKitCard handle={handle} />
        <RateCard handle={handle} />

        {/* Powered-by footer */}
        <p className="text-center text-xs text-muted pt-4">
          Powered by{' '}
          <Link href="/" className="text-accent hover:underline">
            CreatorPulse
          </Link>
        </p>
      </div>
    </main>
  )
}
