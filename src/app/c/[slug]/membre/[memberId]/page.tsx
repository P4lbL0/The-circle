import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { safeEval } from '@/lib/safe-eval'
import { DossierClient } from './DossierClient'

interface Props {
  params: Promise<{ slug: string; memberId: string }>
}

export default async function DossierPage({ params }: Props) {
  const { slug, memberId } = await params
  const supabase = await createClient()

  // Communauté
  const { data: community } = await supabase
    .from('communities')
    .select('id, name, slug, theme_json, owner_id')
    .eq('slug', slug)
    .single()

  if (!community) notFound()

  // Membre
  const { data: member } = await supabase
    .from('community_members')
    .select('*, profiles(id, display_name, avatar_url, email)')
    .eq('id', memberId)
    .eq('community_id', community.id)
    .single()

  if (!member) notFound()

  // Stat schema
  const { data: statSchema } = await supabase
    .from('stat_schemas')
    .select('fields, formula_config')
    .eq('community_id', community.id)
    .single()

  // Utilisateur connecté
  const { data: { user } } = await supabase.auth.getUser()
  const isOwn = !!user && user.id === (member.profiles as any)?.id

  const statFields = (statSchema?.fields as any[] ?? []).filter((f: any) => f.visible_public)
  const formulaConfig = statSchema?.formula_config as any

  // Calcul du score
  let computedScore = member.points
  if (formulaConfig?.expression && statFields.length > 0) {
    try {
      const stats = member.custom_stats as Record<string, number> ?? {}
      computedScore = safeEval(formulaConfig.expression, stats)
    } catch { /* garder points si formule invalide */ }
  }

  const profile = member.profiles as any

  return (
    <DossierClient
      member={{
        id:             member.id,
        role:           member.role,
        points:         member.points,
        badges:         (member.badges as any[] ?? []),
        custom_stats:   (member.custom_stats as any) ?? {},
        joined_at:      member.joined_at,
        computed_score: computedScore,
      }}
      profile={{
        id:           profile?.id ?? '',
        display_name: profile?.display_name ?? null,
        avatar_url:   profile?.avatar_url ?? null,
        email:        profile?.email ?? '',
      }}
      community={{
        name:       community.name,
        slug:       community.slug,
        theme_json: community.theme_json,
      }}
      statFields={statFields}
      formulaLabel={formulaConfig?.label ?? 'Score'}
      isOwn={isOwn}
    />
  )
}
