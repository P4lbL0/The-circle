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

export function VitrineBell({
  communityId,
  userId,
  primaryColor,
  bgColor,
  borderColor,
}: {
  communityId:  string
  userId:       string
  primaryColor: string
  bgColor:      string
  borderColor:  string
}) {
  const supabase = createClient()
  const [open, setOpen]   = useState(false)
  const [items, setItems] = useState<Ann[]>([])
  const [loaded, setLoaded] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const load = async () => {
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
    setLoaded(true)
  }

  useEffect(() => { load() }, [])

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  const markRead = async (id: string) => {
    await supabase.from('announcement_reads').upsert({ announcement_id: id, profile_id: userId })
    setItems(prev => prev.map(a => a.id === id ? { ...a, isRead: true } : a))
  }

  const markAll = async () => {
    const unread = items.filter(a => !a.isRead)
    await Promise.all(unread.map(a =>
      supabase.from('announcement_reads').upsert({ announcement_id: a.id, profile_id: userId })
    ))
    setItems(prev => prev.map(a => ({ ...a, isRead: true })))
  }

  const unread = items.filter(a => !a.isRead).length

  return (
    <div ref={ref} style={{ position: 'relative', flexShrink: 0 }}>
      <button
        onClick={() => setOpen(o => !o)}
        title="Notifications"
        style={{
          background: open ? primaryColor + '18' : 'transparent',
          border: `1px solid ${open ? primaryColor + '55' : borderColor}`,
          borderRadius: '8px', width: '36px', height: '36px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', position: 'relative',
          transition: 'all 0.15s',
        }}
      >
        <span style={{ fontSize: '1rem', lineHeight: 1 }}>🔔</span>
        {loaded && unread > 0 && (
          <span style={{
            position: 'absolute', top: '-3px', right: '-3px',
            background: '#FF2344', color: 'white',
            width: '16px', height: '16px', borderRadius: '50%',
            fontSize: '0.55rem', fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: `2px solid ${bgColor}`,
          }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: '44px', right: 0,
          width: '320px', maxWidth: 'calc(100vw - 40px)',
          background: bgColor,
          border: `1px solid ${borderColor}`,
          borderRadius: '12px',
          boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
          zIndex: 9999,
          maxHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          <div style={{ padding: '12px 14px', borderBottom: `1px solid ${borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.7rem', color: primaryColor, textTransform: 'uppercase', letterSpacing: '1.5px' }}>
              Notifications
            </span>
            {unread > 0 && (
              <button onClick={markAll} style={{ background: 'none', border: 'none', color: primaryColor, fontSize: '0.72rem', cursor: 'pointer', fontFamily: 'Rajdhani, sans-serif', opacity: 0.7, transition: 'opacity 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                onMouseLeave={e => e.currentTarget.style.opacity = '0.7'}>
                Tout lire
              </button>
            )}
          </div>

          <div style={{ overflowY: 'auto', flex: 1 }}>
            {!loaded ? (
              <div style={{ padding: '24px', textAlign: 'center', fontSize: '0.82rem', opacity: 0.4 }}>…</div>
            ) : items.length === 0 ? (
              <div style={{ padding: '28px 16px', textAlign: 'center', fontSize: '0.82rem', opacity: 0.4, fontFamily: 'Rajdhani, sans-serif' }}>
                📭 Aucune notification
              </div>
            ) : items.map(ann => {
              const col = TYPE_COLOR[ann.type] ?? TYPE_COLOR.info
              return (
                <div
                  key={ann.id}
                  onClick={() => !ann.isRead && markRead(ann.id)}
                  style={{
                    padding: '12px 14px',
                    borderBottom: `1px solid ${borderColor}`,
                    background: ann.isRead ? 'transparent' : primaryColor + '08',
                    cursor: ann.isRead ? 'default' : 'pointer',
                    borderLeft: `3px solid ${ann.isRead ? 'transparent' : col}`,
                    transition: 'background 0.15s',
                  }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: ann.isRead ? 'transparent' : col, marginTop: '5px', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap', marginBottom: '3px' }}>
                        <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {ann.title}
                        </span>
                        {ann.community_id === null && (
                          <span style={{ fontSize: '0.58rem', background: primaryColor + '18', border: `1px solid ${primaryColor}33`, color: primaryColor, borderRadius: '3px', padding: '1px 5px', fontFamily: 'Orbitron, sans-serif', flexShrink: 0 }}>
                            GLOBAL
                          </span>
                        )}
                      </div>
                      <p style={{ margin: '0 0 5px', fontSize: '0.78rem', lineHeight: 1.4, fontFamily: 'Rajdhani, sans-serif', opacity: 0.7, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any }}>
                        {ann.content}
                      </p>
                      <span style={{ fontSize: '0.65rem', opacity: 0.4, fontFamily: 'Rajdhani, sans-serif' }}>
                        {new Date(ann.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </span>
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
