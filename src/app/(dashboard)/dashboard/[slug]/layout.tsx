import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardSidebar } from './DashboardSidebar'

interface Props {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}

export default async function DashboardLayout({ children, params }: Props) {
  const { slug } = await params
  const supabase  = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: community } = await supabase
    .from('communities')
    .select('id, name, slug, logo_url, subscription_tier')
    .eq('slug', slug)
    .eq('owner_id', user.id)
    .single()

  if (!community) redirect('/dashboard')

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0a' }}>
      <DashboardSidebar community={community} currentSlug={slug} />
      <main style={{ flex: 1, marginLeft: '240px', minHeight: '100vh' }}>
        {children}
      </main>
    </div>
  )
}