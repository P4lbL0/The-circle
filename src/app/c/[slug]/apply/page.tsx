import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ApplyClient } from './ApplyClient'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function ApplyPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: community } = await supabase
    .from('communities')
    .select('*')
    .eq('slug', slug)
    .eq('privacy', 'public')
    .single()

  if (!community) notFound()

  // Vérifier que le module candidatures est actif et public
  const { data: feature } = await supabase
    .from('features')
    .select('*')
    .eq('community_id', community.id)
    .eq('module', 'applications')
    .eq('enabled', true)
    .single()

  if (!feature) notFound()

  // Récupérer le formulaire personnalisé
  const { data: form } = await supabase
    .from('application_forms')
    .select('*')
    .eq('community_id', community.id)
    .eq('is_active', true)
    .single()

  return (
    <ApplyClient
      community={community}
      formFields={(form?.fields as any[]) ?? []}
    />
  )
}