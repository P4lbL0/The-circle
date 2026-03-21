'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Ann {
  id: string
  title: string
  content: string
  type: string
  created_at: string
  community_id: string | null
  isRead: boolean
}

const TYPE_COLOR: Record<string, string> = {
  info:    '#4CAF50',
  warning: '#FF9800',
  alert:   '#FF2344',
}

export function DashboardBell({ communityId }: { communityId: string }) {
  const supabase = createClient()
  const [open, setOpen]   = useState(false)
  const [items, setItems] = useState<Ann[]>([])
  const [uid, setUid]     = useState<string | null>(null)
  const ref               = useRef<HTMLDivElement>(null)

  // Récupère l'uid en client
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const id = data.user?.id ?? null
      setUid(id)
      if (id) loadAnn(id)
    })
  }, [])

  // Ferme au clic extérieur
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  const loadAnn = async (userId: string) => {
    const [{ data: anns }, { data: reads }] = await Promise.all([
      supabase
        .from('announcements')
        .select('id, title, content, type, created_at, community_id')
        .or(`community_id.eq.${communityId},community_id.is.null`)
        .order('created_at', { ascending: false })
        .limit(20),
      supabase
        .from('announcement_reads')
        .select('announcement_id')
        .eq('profile_id', userId),
    ])
    const readSet = new Set(reads?.map(r => r.announcement_id) ?? [])
    setItems((anns ?? []).map(a => ({ ...a, isRead: readSet.has(a.id) })))
  }

  const markRead = async (id: string) => {
    if (!uid) return
    await supabase.from('announcement_reads').upsert({ announcement_id: id, profile_id: uid })
    setItems(prev => prev.map(a => a.id === id ? { ...a, isRead: true } : a))
  }

  const markAll = async () => {
    if (!uid) return
    const unread = items.filter(a => !a.isRead)
    await Promise.all(unread.map(a =>
      supabase.from('announcement_reads').upsert({ announcement_id: a.id, profile_id: uid })
    ))
    setItems(prev => prev.map(a => ({ ...a, isRead: true })))
  }

  const unread = items.filter(a => !a.isRead).length

  const toggle = () => {
    setOpen(o => !o)
    if (!open && uid) loadAnn(uid)
  }

  if (!uid) return null

  return (
    <div ref={ref} style={{ position: 'relative', flexShrink: 0 }}>
      {/* Bouton cloche */}
      <button
        onClick={toggle}
        title="Notifications"
        style={{
          background: open ? 'rgba(255,193,7,0.12)' : 'transparent',
          border: `1px solid ${open ? '#FFC10755' : '#2a2a2a'}`,
          borderRadius: '8px', width: '34px', height: '34px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', position: 'relative',
          color: open ? '#FFC107' : '#666',
          transition: 'all 0.15s',
          flexShrink: 0,
        }}
        onMouseEnter={e => { if (!open) { e.currentTarget.style.borderColor = '#555'; e.currentTarget.style.color = '#aaa' } }}
        onMouseLeave={e => { if (!open) { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = '#666' } }}
      >
        <span style={{ fontSize: '0.95rem', lineHeight: 1 }}>🔔</span>
        {unread > 0 && (
          <span style={{
            position: 'absolute', top: '-3px', right: '-3px',
            background: '#FF2344', color: 'white',
            width: '16px', height: '16px', borderRadius: '50%',
            fontSize: '0.55rem', fontFamily: 'Orbitron', fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid #0d0d0d',
          }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'fixed',
          top: '60px',
          right: '12px',
          width: '340px',
          maxWidth: 'calc(100vw - 24px)',
          background: '#111',
          border: '1px solid #2a2a2a',
          borderRadius: '12px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.9)',
          zIndex: 9999,
          maxHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          {/* Header dropdown */}
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <span style={{ fontFamily: 'Orbitron', fontSize: '0.72rem', color: '#FFC107', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
              Notifications
            </span>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {unread > 0 && (
                <button onClick={markAll} style={{ background: 'none', border: 'none', color: '#444', fontSize: '0.7rem', cursor: 'pointer', fontFamily: 'Rajdhani', transition: 'color 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#888'}
                  onMouseLeave={e => e.currentTarget.style.color = '#444'}>
                  Tout lire
                </button>
              )}
              <a href={`/dashboard/${communityId.slice(0, 8)}`} style={{ display: 'none' }} />
            </div>
          </div>

          {/* Liste */}
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {items.length === 0 ? (
              <div style={{ padding: '32px 16px', textAlign: 'center', color: '#333', fontSize: '0.82rem', fontFamily: 'Rajdhani' }}>
                📭 Aucune notification
              </div>
            ) : items.map(ann => {
              const col = TYPE_COLOR[ann.type] ?? TYPE_COLOR.info
              return (
                <div
                  key={ann.id}
                  onClick={() => !ann.isRead && markRead(ann.id)}
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid #181818',
                    background: ann.isRead ? 'transparent' : 'rgba(255,193,7,0.03)',
                    cursor: ann.isRead ? 'default' : 'pointer',
                    transition: 'background 0.15s',
                    borderLeft: `3px solid ${ann.isRead ? 'transparent' : col}`,
                  }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    {!ann.isRead && (
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: col, marginTop: '5px', flexShrink: 0 }} />
                    )}
                    {ann.isRead && <div style={{ width: '6px', flexShrink: 0 }} />}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '3px' }}>
                        <span style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.85rem', color: ann.isRead ? '#666' : '#ddd', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {ann.title}
                        </span>
                        {ann.community_id === null && (
                          <span style={{ fontSize: '0.58rem', background: '#FFC10715', border: '1px solid #FFC10730', color: '#FFC107', borderRadius: '3px', padding: '1px 5px', fontFamily: 'Orbitron', flexShrink: 0 }}>
                            GLOBAL
                          </span>
                        )}
                      </div>
                      <p style={{ margin: 0, fontSize: '0.78rem', color: '#555', lineHeight: 1.4, fontFamily: 'Rajdhani', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any }}>
                        {ann.content}
                      </p>
                      <div style={{ fontSize: '0.65rem', color: '#333', marginTop: '5px', fontFamily: 'Rajdhani' }}>
                        {new Date(ann.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
