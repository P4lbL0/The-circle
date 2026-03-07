'use client'

interface Community {
  id:           string
  name:         string
  slug:         string
  logo_url:     string | null
  description:  string | null
  theme_json:   any
  subscription_tier: string
}

export function JoinClient({ community, token }: {
  community: Community
  token:     string
}) {
  const theme  = community.theme_json as {
    primaryColor: string
    accentColor:  string
    font:         string
    darkMode:     boolean
  }

  const bg    = theme.darkMode ? '#0a0a0a' : '#f5f5f5'
  const panel = theme.darkMode ? '#141414' : '#ffffff'
  const text  = theme.darkMode ? '#e0e0e0' : '#1a1a1a'
  const muted = theme.darkMode ? '#666'    : '#999'
  const bord  = theme.darkMode ? '#2a2a2a' : '#e0e0e0'

  return (
    <div style={{ background: bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Rajdhani', sans-serif", padding: '24px' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Rajdhani:wght@400;600;700&family=Oswald:wght@600&family=Montserrat:wght@600&family=Inter:wght@500;600&display=swap');`}</style>

      <div style={{
        background: panel, border: `1px solid ${theme.primaryColor}44`,
        borderRadius: '20px', padding: '50px 40px', maxWidth: '440px', width: '100%',
        textAlign: 'center', boxShadow: `0 0 60px ${theme.primaryColor}15`,
      }}>

        {/* Logo */}
        {community.logo_url ? (
          <img src={community.logo_url} alt={community.name}
            style={{ width: '80px', height: '80px', borderRadius: '16px', objectFit: 'cover', border: `2px solid ${theme.primaryColor}`, marginBottom: '20px' }}
          />
        ) : (
          <div style={{
            width: '80px', height: '80px', borderRadius: '16px',
            background: theme.darkMode ? '#1a1a1a' : '#eee',
            border: `2px solid ${theme.primaryColor}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: `'${theme.font}', sans-serif`, fontSize: '2rem',
            color: theme.primaryColor, margin: '0 auto 20px',
          }}>
            {community.name[0]?.toUpperCase()}
          </div>
        )}

        {/* Titre */}
        <h1 style={{
          fontFamily: `'${theme.font}', sans-serif`, fontSize: '1.4rem',
          color: theme.darkMode ? 'white' : '#111', textTransform: 'uppercase',
          letterSpacing: '2px', margin: '0 0 10px',
        }}>
          {community.name}
        </h1>

        <p style={{ color: muted, fontSize: '0.9rem', margin: '0 0 8px' }}>
          Tu as été invité à rejoindre cette communauté.
        </p>

        {community.description && (
          <p style={{ color: theme.darkMode ? '#888' : '#777', fontSize: '0.88rem', margin: '0 0 30px', lineHeight: 1.5, fontStyle: 'italic' }}>
            "{community.description}"
          </p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Créer un compte */}
          <a
            href={`/signup?redirect=/join/${community.slug}?token=${token}`}
            style={{
              display: 'block', background: theme.primaryColor, color: '#000',
              fontFamily: `'${theme.font}', sans-serif`, fontWeight: 'bold',
              padding: '13px', borderRadius: '6px', textDecoration: 'none',
              textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px',
            }}
          >
            Créer un compte & rejoindre
          </a>

          {/* Déjà un compte */}
          <a
            href={`/login?redirect=/join/${community.slug}?token=${token}`}
            style={{
              display: 'block', background: 'transparent',
              border: `1px solid ${bord}`, color: muted,
              fontFamily: `'${theme.font}', sans-serif`,
              padding: '12px', borderRadius: '6px', textDecoration: 'none',
              textTransform: 'uppercase', fontSize: '0.82rem',
            }}
          >
            J'ai déjà un compte
          </a>

          <a href={`/c/${community.slug}`} style={{ color: muted, fontSize: '0.8rem', marginTop: '6px' }}>
            Voir la vitrine sans rejoindre →
          </a>
        </div>
      </div>
    </div>
  )
}