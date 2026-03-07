import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { MemberCard } from './MemberCard'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function CommunityVitrinePage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: community } = await supabase
    .from('communities')
    .select('*')
    .eq('slug', slug)
    .eq('privacy', 'public')
    .single()

  if (!community) notFound()

  const theme = community.theme_json as {
    primaryColor: string
    accentColor:  string
    font:         string
    darkMode:     boolean
  }

  const bg    = theme.darkMode ? '#0a0a0a' : '#f5f5f5'
  const panel = theme.darkMode ? '#141414' : '#ffffff'
  const text  = theme.darkMode ? '#e0e0e0' : '#1a1a1a'
  const muted = theme.darkMode ? '#666'    : '#999'

  // Membres publics actifs
  const { data: members } = await supabase
    .from('community_members')
    .select('*, profiles(display_name, avatar_url, email)')
    .eq('community_id', community.id)
    .eq('is_public', true)
    .in('role', ['owner', 'moderator', 'member'])
    .order('points', { ascending: false })

  // Modules publics actifs
  const { data: features } = await supabase
    .from('features')
    .select('*')
    .eq('community_id', community.id)
    .eq('enabled', true)

  // Stat schema
  const { data: statSchema } = await supabase
    .from('stat_schemas')
    .select('fields, formula_config')
    .eq('community_id', community.id)
    .single()

  const activeModules   = features?.map(f => f.module) ?? []
  const publicModules   = features?.filter(f => f.visibility === 'public').map(f => f.module) ?? []
  const statFields      = (statSchema?.fields as any[] ?? []).filter((f: any) => f.visible_public)
  const formulaConfig   = statSchema?.formula_config as any

  // Calcul du score global pour chaque membre
  const membersWithScore = (members ?? []).map(member => {
    let score = member.points
    if (formulaConfig?.expression && statFields.length > 0) {
      try {
        const stats = member.custom_stats as Record<string, number> ?? {}
        const keys  = Object.keys(stats)
        const vals  = Object.values(stats)
        // eslint-disable-next-line no-new-func
        const fn    = new Function(...keys, `return ${formulaConfig.expression}`)
        score = Math.round(fn(...vals) * 100) / 100
      } catch { /* garder points si formule invalide */ }
    }
    return { ...member, computed_score: score }
  }).sort((a, b) => b.computed_score - a.computed_score)

  return (
    <div style={{ backgroundColor: bg, minHeight: '100vh', fontFamily: `'Rajdhani', sans-serif`, color: text }}>

      {/* ── FONTS ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;500;600;700&family=Oswald:wght@400;600;700&family=Montserrat:wght@400;600;700&family=Inter:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
      `}</style>

      {/* ── HEADER ── */}
      <header style={{
        backgroundColor: theme.darkMode ? '#0d0d0d' : '#fff',
        borderBottom: `2px solid ${theme.primaryColor}`,
        padding: '15px 30px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        position: 'sticky', top: 0, zIndex: 1000,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {community.logo_url && (
            <img src={community.logo_url} alt={community.name}
              style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', border: `1px solid ${theme.primaryColor}` }}
            />
          )}
          <div>
            <h1 style={{
              margin: 0, fontFamily: `'${theme.font}', sans-serif`,
              fontSize: '1.2rem', color: theme.darkMode ? 'white' : '#111',
              textTransform: 'uppercase', letterSpacing: '2px',
            }}>
              {community.name}
              <span style={{
                fontSize: '0.5em', color: theme.primaryColor,
                border: `1px solid ${theme.primaryColor}`,
                padding: '2px 5px', borderRadius: '3px', marginLeft: '8px', verticalAlign: 'middle',
              }}>
                {community.subscription_tier.toUpperCase()}
              </span>
            </h1>
            <p style={{ margin: 0, fontSize: '0.72rem', color: muted, marginTop: '2px' }}>
              thecircle.app/c/{community.slug}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {publicModules.includes('scores') && (
            <a href={`/c/${slug}/leaderboard`} style={{
              fontFamily: `'${theme.font}', sans-serif`, fontSize: '0.72rem',
              color: muted, border: `1px solid ${theme.darkMode ? '#333' : '#ddd'}`,
              padding: '7px 14px', borderRadius: '4px', textDecoration: 'none',
            }}>
              Classement
            </a>
          )}
          <a href="/login" style={{
            fontFamily: `'${theme.font}', sans-serif`, fontSize: '0.72rem',
            color: theme.primaryColor, border: `1px solid ${theme.primaryColor}`,
            padding: '7px 14px', borderRadius: '4px', textDecoration: 'none',
            textTransform: 'uppercase',
          }}>
            Connexion
          </a>
        </div>
      </header>

      {/* ── HERO ── */}
      <section style={{
        backgroundColor: theme.darkMode ? '#1e1e1e' : '#f0f0f0',
        textAlign: 'center', padding: '80px 30px',
        borderBottom: `5px solid ${theme.primaryColor}`,
        boxShadow: `0 0 30px ${theme.primaryColor}18`,
        position: 'relative', overflow: 'hidden',
      }}>
        {community.banner_url && (
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${community.banner_url})`,
            backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.15,
          }} />
        )}
        <div style={{ position: 'relative', display: 'inline-block', background: 'rgba(0,0,0,0.45)', padding: '30px 50px', borderRadius: '8px', maxWidth: '800px' }}>
          {community.logo_url && (
            <img src={community.logo_url} alt={community.name}
              style={{ width: '72px', height: '72px', borderRadius: '12px', objectFit: 'cover', marginBottom: '18px', border: `2px solid ${theme.primaryColor}` }}
            />
          )}
          <h2 style={{
            fontFamily: `'${theme.font}', sans-serif`, fontSize: '2.4rem',
            fontWeight: 700, textTransform: 'uppercase',
            color: theme.darkMode ? 'white' : '#111', margin: '0 0 14px',
          }}>
            Bienvenue dans{' '}
            <span style={{ color: theme.primaryColor, textShadow: `0 0 12px ${theme.primaryColor}88` }}>
              {community.name}
            </span>
          </h2>

          {community.description && (
            <p style={{ fontSize: '1.05rem', color: theme.darkMode ? '#ccc' : '#555', maxWidth: '600px', margin: '0 auto 24px', lineHeight: 1.6 }}>
              {community.description}
            </p>
          )}

          {/* Stats rapides */}
          <div style={{
            display: 'inline-flex', background: theme.darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.05)',
            border: `1px solid ${theme.primaryColor}22`, borderRadius: '10px', padding: '14px 24px',
            gap: '0', marginBottom: publicModules.includes('applications') ? '24px' : '0',
          }}>
            {[
              { value: membersWithScore.length, label: 'Membres' },
              { value: activeModules.length,    label: 'Modules' },
            ].map((stat, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                {i > 0 && <div style={{ width: '1px', height: '36px', background: theme.darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.1)', margin: '0 20px' }} />}
                <div style={{ textAlign: 'center', minWidth: '90px' }}>
                  <div style={{ fontFamily: `'${theme.font}', sans-serif`, color: theme.primaryColor, fontSize: '1.5rem', fontWeight: 700 }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: muted, marginTop: '4px' }}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {publicModules.includes('applications') && (
            <div>
              <a href={`/c/${slug}/apply`} style={{
                display: 'inline-block',
                background: theme.primaryColor, color: '#121212',
                fontFamily: `'${theme.font}', sans-serif`, fontWeight: 'bold',
                padding: '12px 28px', borderRadius: '4px', textDecoration: 'none',
                textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px',
              }}>
                Rejoindre la communauté
              </a>
            </div>
          )}
        </div>
      </section>

      {/* ── MEMBRES ── */}
      <section style={{ padding: '50px 30px', maxWidth: '1200px', margin: '0 auto' }}>
        <h3 style={{
          fontFamily: `'${theme.font}', sans-serif`,
          color: theme.darkMode ? 'white' : '#111',
          borderLeft: `4px solid ${theme.primaryColor}`,
          paddingLeft: '15px', marginBottom: '30px', fontSize: '1.5rem',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          Membres
          <span style={{ fontSize: '0.72rem', color: muted, fontFamily: 'Rajdhani', letterSpacing: '1px' }}>
            {membersWithScore.length} MEMBRE{membersWithScore.length > 1 ? 'S' : ''}
          </span>
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
          {membersWithScore.map((member, idx) => (
            <MemberCard
              key={member.id}
              member={member}
              rank={idx + 1}
              theme={theme}
              statFields={statFields}
              formulaLabel={formulaConfig?.label ?? 'Score'}
            />
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: `1px solid ${theme.darkMode ? '#222' : '#ddd'}`,
        textAlign: 'center', padding: '28px',
        color: theme.darkMode ? '#333' : '#bbb', fontSize: '0.82rem',
      }}>
        Propulsé par{' '}
        <a href="/" style={{ color: theme.primaryColor, textDecoration: 'none', fontFamily: `'${theme.font}', sans-serif`, fontSize: '0.78rem' }}>
          THE CIRCLE
        </a>
      </footer>
    </div>
  )
}