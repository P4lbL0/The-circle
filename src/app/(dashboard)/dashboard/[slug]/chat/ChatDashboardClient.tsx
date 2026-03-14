'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getSoftLimit } from '@/lib/plan-limits'

interface Group {
  id:         string
  name:       string
  is_public:  boolean
  created_at: string
}

export function ChatDashboardClient({ community, initialGroups }: { community: any; initialGroups: Group[] }) {
  const supabase = createClient()

  const [groups, setGroups]       = useState<Group[]>(initialGroups)
  const [showForm, setShowForm]   = useState(false)
  const [groupName, setGroupName] = useState('')
  const [isPublic, setIsPublic]   = useState(true)
  const [saving, setSaving]       = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName]   = useState('')
  const [toast, setToast]         = useState<string | null>(null)

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500) }

  const S = {
    input: (): React.CSSProperties => ({
      background: '#0a0a0a', border: '1px solid #2a2a2a', color: '#e0e0e0',
      padding: '9px 14px', borderRadius: '6px', fontFamily: 'Rajdhani',
      fontSize: '0.95rem', outline: 'none', width: '100%', boxSizing: 'border-box' as const,
    }),
    btn: (active?: boolean): React.CSSProperties => ({
      background: active ? '#FFC107' : '#1a1a1a', color: active ? '#000' : '#888',
      border: `1px solid ${active ? '#FFC107' : '#2a2a2a'}`,
      padding: '8px 18px', borderRadius: '6px', cursor: 'pointer',
      fontFamily: 'Orbitron', fontSize: '0.72rem', textTransform: 'uppercase' as const,
      letterSpacing: '1px', transition: 'all 0.15s',
    }),
  }

  const createGroup = async () => {
    if (!groupName.trim()) return

    const limit = getSoftLimit(community.subscription_tier, 'chat_groups')
    if (limit !== Infinity && groups.length >= limit) {
      showToast(`Limite de ${limit} groupes (plan Free) — passez au Starter`)
      return
    }

    setSaving(true)
    const { data, error } = await supabase
      .from('chat_groups')
      .insert({ community_id: community.id, name: groupName.trim(), is_public: isPublic })
      .select('id, name, is_public, created_at')
      .single()

    if (!error && data) {
      setGroups(prev => [...prev, data])
      setGroupName('')
      setShowForm(false)
      showToast('Groupe créé')
    } else if (error) {
      showToast(`Erreur : ${error.message}`)
    }
    setSaving(false)
  }

  const startRename = (group: Group) => {
    setEditingId(group.id)
    setEditName(group.name)
  }

  const confirmRename = async (id: string) => {
    if (!editName.trim()) return
    const { error } = await supabase.from('chat_groups').update({ name: editName.trim() }).eq('id', id)
    if (!error) {
      setGroups(prev => prev.map(g => g.id === id ? { ...g, name: editName.trim() } : g))
      setEditingId(null)
      showToast('Groupe renommé')
    }
  }

  const toggleVisibility = async (group: Group) => {
    const newVal = !group.is_public
    const { error } = await supabase.from('chat_groups').update({ is_public: newVal }).eq('id', group.id)
    if (!error) setGroups(prev => prev.map(g => g.id === group.id ? { ...g, is_public: newVal } : g))
  }

  const deleteGroup = async (id: string) => {
    if (!confirm('Supprimer ce groupe et tous ses messages ?')) return
    const { error } = await supabase.from('chat_groups').delete().eq('id', id)
    if (!error) {
      setGroups(prev => prev.filter(g => g.id !== id))
      showToast('Groupe supprimé')
    }
  }

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', fontFamily: "'Rajdhani', sans-serif", color: '#e0e0e0' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Rajdhani:wght@400;600;700&display=swap');
        .chat-dash-header  { padding: 14px 30px !important; }
        .chat-dash-content { max-width: 900px; margin: 0 auto; padding: 30px; }
        .chat-group-row    { padding: 14px 18px; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        @media (max-width: 768px) {
          .chat-dash-header  { padding: 12px 16px !important; }
          .chat-dash-content { padding: 16px !important; }
          .chat-group-row    { gap: 8px; }
        }
      `}</style>

      {toast && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, background: '#1a1a1a', border: '1px solid #4CAF50', color: '#4CAF50', padding: '12px 20px', borderRadius: '8px', fontFamily: 'Orbitron', fontSize: '0.8rem' }}>
          ✓ {toast}
        </div>
      )}

      {/* Header */}
      <div className="chat-dash-header" style={{ background: '#0d0d0d', borderBottom: '2px solid #FFC107', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontFamily: 'Orbitron', fontSize: '0.9rem', color: 'white', textTransform: 'uppercase', letterSpacing: '2px' }}>Chat</span>
          <a href={`/c/${community.slug}/chat`} target="_blank" style={{ color: '#444', fontSize: '0.72rem', textDecoration: 'none', border: '1px solid #222', padding: '4px 10px', borderRadius: '4px', fontFamily: 'Orbitron', textTransform: 'uppercase' }}>
            Voir ↗
          </a>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={S.btn(showForm)}>+ Groupe</button>
      </div>

      <div className="chat-dash-content">

        {/* Formulaire nouveau groupe */}
        {showForm && (
          <div style={{ background: '#141414', border: '1px solid #FFC107', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
            <h3 style={{ fontFamily: 'Orbitron', fontSize: '0.82rem', color: '#FFC107', textTransform: 'uppercase', margin: '0 0 16px' }}>Nouveau groupe de discussion</h3>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap' }}>
              <input
                value={groupName}
                onChange={e => setGroupName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && createGroup()}
                placeholder="Nom du groupe..."
                style={{ ...S.input(), flex: 1 }}
                autoFocus
              />
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: '#888', fontSize: '0.88rem', whiteSpace: 'nowrap' as const }}>
                <input type="checkbox" checked={isPublic} onChange={e => setIsPublic(e.target.checked)} style={{ accentColor: '#FFC107' }} />
                Public
              </label>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setShowForm(false)} style={S.btn()}>Annuler</button>
              <button onClick={createGroup} disabled={saving} style={{ ...S.btn(true), opacity: saving ? 0.6 : 1 }}>
                {saving ? 'Création...' : 'Créer'}
              </button>
            </div>
          </div>
        )}

        {/* État vide */}
        {groups.length === 0 && !showForm ? (
          <div style={{ textAlign: 'center', padding: '80px 40px', border: '1px dashed #222', borderRadius: '12px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>💬</div>
            <h3 style={{ fontFamily: 'Orbitron', color: '#444', fontSize: '0.9rem', textTransform: 'uppercase', margin: '0 0 10px' }}>Aucun groupe</h3>
            <p style={{ color: '#333', fontSize: '0.88rem', margin: '0 0 20px' }}>Crée des groupes pour organiser les discussions de ta communauté.</p>
            <button onClick={() => setShowForm(true)} style={S.btn(true)}>+ Créer un groupe</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {groups.map(group => (
              <div key={group.id} style={{ background: '#141414', border: '1px solid #222', borderRadius: '12px', overflow: 'hidden' }}>
                <div className="chat-group-row">
                  <span style={{ fontSize: '1.1rem' }}>💬</span>

                  {/* Nom / champ rename */}
                  {editingId === group.id ? (
                    <input
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter')  confirmRename(group.id)
                        if (e.key === 'Escape') setEditingId(null)
                      }}
                      style={{ ...S.input(), flex: 1, padding: '5px 10px' }}
                      autoFocus
                    />
                  ) : (
                    <span style={{ fontFamily: 'Orbitron', fontSize: '0.82rem', color: '#FFC107', textTransform: 'uppercase', flex: 1 }}>
                      {group.name}
                    </span>
                  )}

                  {/* Badge visibilité */}
                  <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '3px', border: `1px solid ${group.is_public ? '#4CAF5055' : '#2196F355'}`, color: group.is_public ? '#4CAF5099' : '#2196F399', whiteSpace: 'nowrap' }}>
                    {group.is_public ? '🌍 Public' : '🔒 Membres'}
                  </span>

                  {/* Lien voir */}
                  <a href={`/c/${community.slug}/chat/${group.id}`} target="_blank" style={{ color: '#444', fontSize: '0.7rem', textDecoration: 'none', border: '1px solid #2a2a2a', padding: '4px 8px', borderRadius: '4px', whiteSpace: 'nowrap' }}>
                    Voir ↗
                  </a>

                  {/* Actions */}
                  {editingId === group.id ? (
                    <>
                      <button onClick={() => confirmRename(group.id)} style={{ ...S.btn(true), padding: '4px 10px', fontSize: '0.65rem' }}>✓</button>
                      <button onClick={() => setEditingId(null)}       style={{ ...S.btn(),      padding: '4px 10px', fontSize: '0.65rem' }}>✕</button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startRename(group)}
                        style={{ background: 'transparent', border: '1px solid #2a2a2a', color: '#555', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                        title="Renommer"
                      >✏️</button>
                      <button
                        onClick={() => toggleVisibility(group)}
                        style={{ background: 'transparent', border: '1px solid #2a2a2a', color: '#555', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                        title={group.is_public ? 'Rendre privé' : 'Rendre public'}
                      >{group.is_public ? '🔒' : '🌍'}</button>
                      <button
                        onClick={() => deleteGroup(group.id)}
                        style={{ background: 'transparent', border: '1px solid #2a2a2a', color: '#555', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                        onMouseEnter={e => { (e.currentTarget).style.color = '#FF2344'; (e.currentTarget).style.borderColor = '#FF2344' }}
                        onMouseLeave={e => { (e.currentTarget).style.color = '#555';    (e.currentTarget).style.borderColor = '#2a2a2a' }}
                        title="Supprimer"
                      >🗑</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
