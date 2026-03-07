'use client'

import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface Community {
  id: string
  name: string
  slug: string
  logo_url: string | null
  subscription_tier: string
}

const NAV_ITEMS = [
  { href: '',             icon: '⚡', label: 'Vue d\'ensemble' },
  { href: '/members',     icon: '👥', label: 'Membres'         },
  { href: '/modules',     icon: '🧩', label: 'Modules'         },
  { href: '/stats',       icon: '📊', label: 'Stats'           },
  { href: '/applications', icon: '📋', label: 'Candidatures'   },
  { href: '/appearance',  icon: '🎨', label: 'Apparence'       },
  { href: '/settings',    icon: '⚙️',  label: 'Paramètres'     },
]

export function DashboardSidebar({ community, currentSlug }: {
  community: Community
  currentSlug: string
}) {
  const pathname = usePathname()
  const router   = useRouter()
  const supabase = createClient()

  const base = `/dashboard/${community.slug}`

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside style={{
      position: 'fixed', top: 0, left: 0,
      width: '240px', height: '100vh',
      background: '#0d0d0d',
      borderRight: '1px solid #1a1a1a',
      display: 'flex', flexDirection: 'column',
      zIndex: 200,
      fontFamily: "'Rajdhani', sans-serif",
    }}>

      {/* Logo + nom */}
      <div style={{
        padding: '20px 18px',
        borderBottom: '1px solid #1a1a1a',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '8px',
            background: '#1a1a1a', border: '1px solid #FFC107',
            overflow: 'hidden', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Orbitron', fontSize: '1rem', color: '#FFC107',
          }}>
            {community.logo_url
              ? <img src={community.logo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : community.name[0]?.toUpperCase()
            }
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontFamily: 'Orbitron', fontSize: '0.78rem', color: 'white',
              textTransform: 'uppercase', letterSpacing: '1px',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {community.name}
            </div>
            <div style={{
              fontSize: '0.7rem', color: '#FFC107',
              textTransform: 'uppercase', letterSpacing: '1px', marginTop: '2px',
            }}>
              {community.subscription_tier}
            </div>
          </div>
        </div>

        {/* Lien vitrine */}
        <a
          href={`/c/${community.slug}`}
          target="_blank"
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: '#1a1a1a', border: '1px solid #2a2a2a',
            borderRadius: '6px', padding: '7px 12px',
            color: '#666', fontSize: '0.78rem', textDecoration: 'none',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => {
            (e.currentTarget).style.borderColor = '#FFC107'
            ;(e.currentTarget).style.color = '#FFC107'
          }}
          onMouseLeave={e => {
            (e.currentTarget).style.borderColor = '#2a2a2a'
            ;(e.currentTarget).style.color = '#666'
          }}
        >
          <span style={{ fontSize: '0.8rem' }}>🌐</span>
          <span>Voir la vitrine</span>
          <span style={{ marginLeft: 'auto', fontSize: '0.7rem' }}>↗</span>
        </a>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
        <div style={{ fontSize: '0.65rem', color: '#333', textTransform: 'uppercase', letterSpacing: '2px', padding: '4px 8px 10px', fontFamily: 'Orbitron' }}>
          Dashboard
        </div>
        {NAV_ITEMS.map(item => {
          const href    = `${base}${item.href}`
          const isActive = item.href === ''
            ? pathname === base
            : pathname.startsWith(href)

          return (
            <a
              key={item.href}
              href={href}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '9px 12px', borderRadius: '8px',
                marginBottom: '2px',
                background: isActive ? 'rgba(255,193,7,0.1)' : 'transparent',
                borderLeft: isActive ? '3px solid #FFC107' : '3px solid transparent',
                color: isActive ? '#FFC107' : '#666',
                textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600,
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  (e.currentTarget).style.background = 'rgba(255,255,255,0.04)'
                  ;(e.currentTarget).style.color = '#aaa'
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  (e.currentTarget).style.background = 'transparent'
                  ;(e.currentTarget).style.color = '#666'
                }
              }}
            >
              <span style={{ fontSize: '1rem', flexShrink: 0 }}>{item.icon}</span>
              <span>{item.label}</span>
            </a>
          )
        })}
      </nav>

      {/* Footer sidebar */}
      <div style={{
        padding: '14px 10px',
        borderTop: '1px solid #1a1a1a',
        display: 'flex', flexDirection: 'column', gap: '4px',
      }}>
        <a
          href="/dashboard"
          style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '9px 12px', borderRadius: '8px',
            color: '#444', textDecoration: 'none', fontSize: '0.88rem',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { (e.currentTarget).style.color = '#888' }}
          onMouseLeave={e => { (e.currentTarget).style.color = '#444' }}
        >
          <span>🏠</span>
          <span>Mes communautés</span>
        </a>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '9px 12px', borderRadius: '8px',
            background: 'transparent', border: 'none',
            color: '#444', cursor: 'pointer', fontSize: '0.88rem',
            width: '100%', textAlign: 'left', transition: 'all 0.15s',
          }}
          onMouseEnter={e => {
            (e.currentTarget).style.color = '#FF2344'
            ;(e.currentTarget).style.background = 'rgba(255,35,68,0.08)'
          }}
          onMouseLeave={e => {
            (e.currentTarget).style.color = '#444'
            ;(e.currentTarget).style.background = 'transparent'
          }}
        >
          <span>🚪</span>
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  )
}