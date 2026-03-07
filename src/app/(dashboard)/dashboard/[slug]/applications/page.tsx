import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ApplicationsClient } from './ApplicationsClient'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function ApplicationsPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: community } = await supabase
    .from('communities')
    .select('id, name, slug')
    .eq('slug', slug)
    .eq('owner_id', user.id)
    .single()

  if (!community) redirect('/dashboard')

  const { data: applications } = await supabase
    .from('applications')
    .select('*')
    .eq('community_id', community.id)
    .order('created_at', { ascending: false })

  const { data: appForm } = await supabase
    .from('application_forms')
    .select('*')
    .eq('community_id', community.id)
    .single()

  return (
    <ApplicationsClient
      community={community}
      initialApplications={applications ?? []}
      formFields={(appForm?.fields as any[]) ?? []}
      formActive={appForm?.is_active ?? false}
    />
  )
}