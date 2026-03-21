'use client'

import { useEffect } from 'react'
import { generateBadgeCSS, BADGE_COLORS, BADGE_EFFECTS, BADGE_FRAMES } from '@/lib/badgeConfig'
import type { BadgeDef } from '@/lib/badgeConfig'

// ── Injection CSS côté client (singleton) ──────────────────────────────────────
let cssInjected = false
function ensureBadgeCSS() {
  if (typeof document === 'undefined' || cssInjected) return
  if (document.getElementById('tc-badge-styles')) { cssInjected = true; return }
  const style = document.createElement('style')
  style.id = 'tc-badge-styles'
  style.textContent = generateBadgeCSS()
  document.head.appendChild(style)
  cssInjected = true
}

// ── Composant Badge ────────────────────────────────────────────────────────────
export function Badge({
  badge,
  size = 'sm',
  className = '',
}: {
  badge: BadgeDef
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  useEffect(() => { ensureBadgeCSS() }, [])

  const isHex = badge.color?.startsWith('#')

  const classes = [
    'tc-badge',
    `tc-badge-${size}`,
    badge.color && !isHex ? `tc-badge-${badge.color}` : '',
    badge.effect ? `tc-effect-${badge.effect}` : '',
    badge.frame  ? `tc-frame-${badge.frame}`  : '',
    className,
  ].filter(Boolean).join(' ')

  const inlineStyle: React.CSSProperties = isHex ? {
    border: `1px solid ${badge.color}`,
    color: badge.color,
    background: `${badge.color}18`,
  } : {}

  return (
    <span className={classes} style={inlineStyle} title={badge.desc || badge.name}>
      {badge.name}
    </span>
  )
}

// ── Injection CSS côté serveur (SSR) ───────────────────────────────────────────
// Utilisez ce composant une fois dans la page (server component) pour pré-injecter le CSS
export function BadgeStyles() {
  return <style dangerouslySetInnerHTML={{ __html: generateBadgeCSS() }} />
}

// ── Re-exports pratiques ───────────────────────────────────────────────────────
export { BADGE_COLORS, BADGE_EFFECTS, BADGE_FRAMES }
export type { BadgeDef }
