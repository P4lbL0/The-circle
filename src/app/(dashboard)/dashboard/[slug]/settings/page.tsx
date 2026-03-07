import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SettingsClient } from './SettingsClient'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function SettingsPage({ params }: Props) {
  const { slug } = await params
  const supabase  = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: community } = await supabase
    .from('communities')
    .select('*')
    .eq('slug', slug)
    .eq('owner_id', user.id)
    .single()

  if (!community) redirect('/dashboard')

  return <SettingsClient community={community} />
}