import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { JoinClient } from './JoinClient'

interface Props {
  params:      Promise<{ slug: string }>
  searchParams: Promise<{ token?: string }>
}

export default async function JoinPage({ params, searchParams }: Props) {
  const { slug }  = await params
  const { token } = await searchParams
  const supabase  = await createClient()

  if (!token) notFound()

  const { data: community } = await supabase
    .from('communities')
    .select('id, name, slug, logo_url, description, theme_json, subscription_tier')
    .eq('slug', slug)
    .single()

  if (!community) notFound()

  // Vérifier si l'user est déjà connecté
  const { data: { user } } = await supabase.auth.getUser()

  // Si connecté → vérifier s'il est déjà membre
  if (user) {
    const { data: existing } = await supabase
      .from('community_members')
      .select('id, role')
      .eq('community_id', community.id)
      .eq('profile_id', user.id)
      .single()

    if (existing) {
      // Déjà membre → rediriger vers la vitrine
      redirect(`/c/${slug}`)
    }

    // Pas encore membre → l'ajouter directement
    await supabase
      .from('community_members')
      .insert({
        community_id: community.id,
        profile_id:   user.id,
        role:         'member',
      })

    redirect(`/c/${slug}`)
  }

  // Non connecté → afficher page d'accueil du lien
  return <JoinClient community={community} token={token} />
}