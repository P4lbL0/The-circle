import { createClient }        from '@/lib/supabase/server'
import { redirect }            from 'next/navigation'
import { ChatDashboardClient } from './ChatDashboardClient'

interface Props { params: Promise<{ slug: string }> }

export default async function ChatDashboardPage({ params }: Props) {
  const { slug } = await params
  const supabase  = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: community } = await supabase
    .from('communities').select('id, name, slug, subscription_tier')
    .eq('slug', slug).eq('owner_id', user.id).single()
  if (!community) redirect('/dashboard')

  const { data: groups } = await supabase
    .from('chat_groups')
    .select('id, name, is_public, created_at')
    .eq('community_id', community.id)
    .order('created_at', { ascending: true })

  return <ChatDashboardClient community={community} initialGroups={groups ?? []} />
}
