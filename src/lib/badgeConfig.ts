/**
 * Configuration des badges — The Circle
 *
 * ✅ Pour ajouter un NOUVEL EFFET  → ajoutez une entrée dans BADGE_EFFECTS
 * ✅ Pour ajouter une NOUVELLE FRAME → ajoutez une entrée dans BADGE_FRAMES
 * ✅ Pour ajouter une NOUVELLE COULEUR → ajoutez une entrée dans BADGE_COLORS
 *    et ajoutez son CSS dans generateBadgeCSS() section Couleurs spéciales
 *
 * Aucune autre modification de code requise.
 */

export interface BadgeDef {
  name: string
  color?: string   // HEX (#FF0000) OU id couleur (realgold, galaxy…)
  effect?: string  // id d'effet (holo, pulse, glitch…)
  frame?: string   // id de frame (elite, cyber, mythic…)
  desc?: string
  awarded_at?: string
}

export interface BadgeColorDef {
  id: string
  label: string
  preview: string  // HEX pour les aperçus dans la Forge
}

export interface BadgeEffectDef {
  id: string
  label: string
  keyframes: string    // bloc @keyframes
  classStyles: string  // styles de la classe .tc-effect-{id}
}

export interface BadgeFrameDef {
  id: string
  label: string
  keyframes?: string
  classStyles: string
}

// ─── COULEURS ─────────────────────────────────────────────────────────────────
export const BADGE_COLORS: BadgeColorDef[] = [
  { id: 'gold',        label: 'Or',          preview: '#FFD700' },
  { id: 'realgold',    label: 'Or Royal ✨',  preview: '#FCF6BA' },
  { id: 'realsilver',  label: 'Argent',       preview: '#C0C0C0' },
  { id: 'realdiamond', label: 'Diamant 💎',   preview: '#00e5ff' },
  { id: 'galaxy',      label: 'Galaxie',      preview: '#9c27b0' },
  { id: 'magma',       label: 'Magma',        preview: '#ff4500' },
  { id: 'obsidian',    label: 'Obsidienne',   preview: '#6a1b9a' },
  { id: 'ice',         label: 'Glace',        preview: '#b3e5fc' },
  { id: 'horror',      label: 'Horror',       preview: '#b71c1c' },
  { id: 'pigeon',      label: 'Pigeon 🕊',    preview: '#9e9e9e' },
  { id: 'clown',       label: 'Clown 🤡',     preview: '#ff1744' },
  { id: 'red',         label: 'Rouge',        preview: '#f44336' },
  { id: 'blue',        label: 'Bleu',         preview: '#2196F3' },
  { id: 'green',       label: 'Vert',         preview: '#4CAF50' },
  { id: 'purple',      label: 'Violet',       preview: '#9c27b0' },
  { id: 'cyan',        label: 'Cyan',         preview: '#00bcd4' },
  { id: 'pink',        label: 'Rose',         preview: '#E91E63' },
  { id: 'orange',      label: 'Orange',       preview: '#FF9800' },
  { id: 'lime',        label: 'Lime',         preview: '#8BC34A' },
  { id: 'black',       label: 'Noir',         preview: '#424242' },
  { id: 'white',       label: 'Blanc',        preview: '#e0e0e0' },
  { id: 'crimson',     label: 'Cramoisi',     preview: '#dc143c' },
  { id: 'sunset',      label: 'Sunset',       preview: '#ff6b35' },
  { id: 'midnight',    label: 'Minuit',       preview: '#3949ab' },
  { id: 'toxic',       label: 'Toxique ☢',   preview: '#39ff14' },
]

// ─── EFFETS ───────────────────────────────────────────────────────────────────
// Pour ajouter un effet : copiez un bloc ci-dessous, modifiez id/label/keyframes/classStyles
export const BADGE_EFFECTS: BadgeEffectDef[] = [
  {
    id: 'holo',
    label: '🌈 Holographique',
    keyframes: `@keyframes tcHolo{0%{background-position:0% 50%}100%{background-position:200% 50%}}`,
    classStyles: `.tc-effect-holo{background:linear-gradient(90deg,#ff006680,#ffff0080,#00ff8880,#0088ff80,#ff006680)!important;background-size:300% 100%!important;animation:tcHolo 2s linear infinite!important;}`,
  },
  {
    id: 'shine',
    label: '✨ Brillant',
    keyframes: `@keyframes tcShine{0%{left:-100%}30%{left:150%}100%{left:150%}}`,
    classStyles: `.tc-effect-shine{overflow:hidden!important;}.tc-effect-shine::after{content:'';position:absolute;top:-20%;left:-100%;width:50%;height:140%;background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,.45) 50%,transparent 60%);animation:tcShine 3s infinite;transform:skewX(-20deg);pointer-events:none;}`,
  },
  {
    id: 'pulse',
    label: '💓 Pulsation',
    keyframes: `@keyframes tcPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}`,
    classStyles: `.tc-effect-pulse{animation:tcPulse 2s ease-in-out infinite;}`,
  },
  {
    id: 'electric',
    label: '⚡ Électrique',
    keyframes: `@keyframes tcElec{0%{transform:translate(0,0)}20%{transform:translate(-1px,1px)}40%{transform:translate(1px,-1px)}60%{transform:translate(-1px,-1px)}80%{transform:translate(1px,1px)}100%{transform:translate(0,0)}}`,
    classStyles: `.tc-effect-electric{animation:tcElec .8s infinite;}`,
  },
  {
    id: 'glitch',
    label: '📺 Glitch',
    keyframes: `@keyframes tcGlitch{0%,88%,100%{transform:translate(0);filter:none;clip-path:none}90%{transform:translate(-2px,1px);filter:invert(1) hue-rotate(90deg)}92%{transform:translate(2px,-1px);clip-path:inset(20% 0 30% 0)}95%{transform:translate(-1px,2px);filter:invert(.5)}97%{transform:translate(1px,-2px);clip-path:inset(60% 0 10% 0)}}`,
    classStyles: `.tc-effect-glitch{animation:tcGlitch 4s infinite;}`,
  },
  {
    id: 'burn',
    label: '🔥 Brûlant',
    keyframes: `@keyframes tcBurn{0%,100%{box-shadow:0 0 5px currentColor,0 0 10px currentColor}50%{box-shadow:0 0 15px currentColor,0 0 30px currentColor,0 0 50px rgba(255,100,0,.5)}}`,
    classStyles: `.tc-effect-burn{animation:tcBurn 1.5s ease-in-out infinite;}`,
  },
  {
    id: 'toxic_glow',
    label: '☢ Radioactif',
    keyframes: `@keyframes tcToxicGlow{0%,100%{text-shadow:0 0 4px #2ecc71}50%{text-shadow:0 0 10px #2ecc71,0 0 20px #2ecc71,0 0 30px #27ae60}}`,
    classStyles: `.tc-effect-toxic_glow{animation:tcToxicGlow 1.5s ease-in-out infinite;color:#2ecc71!important;}`,
  },
  {
    id: 'lightning',
    label: '🌩 Foudre',
    keyframes: `@keyframes tcLightning{0%{box-shadow:0 0 2px #d32f2f,inset 0 0 2px #d32f2f;opacity:.8}100%{box-shadow:0 0 15px #ff1744,0 0 25px #ff1744,inset 0 0 8px rgba(255,23,68,.4);opacity:1}}`,
    classStyles: `.tc-effect-lightning{animation:tcLightning 1.2s alternate infinite;border-color:#ff1744!important;}`,
  },
  {
    id: 'rainbow',
    label: '🎨 Arc-en-ciel',
    keyframes: `@keyframes tcRainbow{0%{filter:hue-rotate(0deg)}100%{filter:hue-rotate(360deg)}}`,
    classStyles: `.tc-effect-rainbow{animation:tcRainbow 3s linear infinite;}`,
  },
  {
    id: 'matrix',
    label: '💻 Matrix',
    keyframes: `@keyframes tcMatrix{0%,100%{text-shadow:0 0 4px #00ff41,0 0 8px #00ff41;color:#00ff41}50%{text-shadow:0 0 2px #003b00;color:#00aa20}}`,
    classStyles: `.tc-effect-matrix{animation:tcMatrix 1s steps(2) infinite;font-family:monospace!important;border-color:#00ff41!important;background:rgba(0,255,65,.1)!important;}`,
  },
  {
    id: 'neon_flicker',
    label: '💡 Néon',
    keyframes: `@keyframes tcNeon{0%,19%,21%,23%,25%,54%,56%,100%{opacity:1}20%,24%,55%{opacity:.15}}`,
    classStyles: `.tc-effect-neon_flicker{animation:tcNeon 5s infinite;filter:brightness(1.3);}`,
  },
  {
    id: 'fire',
    label: '🔥 Flammes',
    keyframes: `@keyframes tcFire{0%,100%{box-shadow:0 0 5px #ff4500,0 0 10px #ff6600;background-position:0% 50%}50%{box-shadow:0 0 20px #ff0000,0 0 35px #ff4500;background-position:100% 50%}}`,
    classStyles: `.tc-effect-fire{background:linear-gradient(135deg,#ff0000,#ff4500,#ff8c00,#ff4500,#ff0000)!important;background-size:200% 200%!important;animation:tcFire 2s ease-in-out infinite!important;color:#fff!important;border:none!important;}`,
  },
  {
    id: 'frost',
    label: '❄ Cristal de glace',
    keyframes: `@keyframes tcFrost{0%,100%{text-shadow:0 0 4px #81d4fa,0 0 8px #b3e5fc;filter:brightness(1)}50%{text-shadow:0 0 12px #e1f5fe,0 0 20px #80deea;filter:brightness(1.3) saturate(1.2)}}`,
    classStyles: `.tc-effect-frost{animation:tcFrost 2.5s ease-in-out infinite;color:#b3e5fc!important;border-color:#81d4fa!important;}`,
  },
  // ── Ajoutez de nouveaux effets ici ──
]

// ─── FRAMES ───────────────────────────────────────────────────────────────────
export const BADGE_FRAMES: BadgeFrameDef[] = [
  {
    id: 'elite',
    label: '💀 Elite',
    classStyles: `.tc-frame-elite{box-shadow:0 0 0 2px #660505,0 0 0 4px #6d0000,0 0 10px rgba(139,0,0,.5);}`,
  },
  {
    id: 'cyber',
    label: '🤖 Cyber',
    classStyles: `.tc-frame-cyber{border:1px solid #00e5ff!important;box-shadow:inset 0 0 6px rgba(0,229,255,.3),0 0 8px #00e5ff;clip-path:polygon(6px 0,100% 0,100% calc(100% - 6px),calc(100% - 6px) 100%,0 100%,0 6px);}`,
  },
  {
    id: 'hazard',
    label: '⚠ Danger',
    classStyles: `.tc-frame-hazard{border:2px dashed #FFD700!important;outline:2px dashed rgba(255,0,0,.4);outline-offset:1px;}`,
  },
  {
    id: 'spectral',
    label: '👻 Spectral',
    keyframes: `@keyframes tcSpectral{0%,100%{box-shadow:0 0 6px #9c27b0}50%{box-shadow:0 0 18px #9c27b0,0 0 35px rgba(156,39,176,.4)}}`,
    classStyles: `.tc-frame-spectral{border-color:#9c27b0!important;animation:tcSpectral 3s ease-in-out infinite;}`,
  },
  {
    id: 'blood',
    label: '🩸 Sang',
    keyframes: `@keyframes tcBlood{0%,100%{border-color:#6d0000;box-shadow:0 0 8px #b71c1c}50%{border-color:#ff5252;box-shadow:0 0 18px #ff1744,0 0 30px rgba(183,28,28,.4)}}`,
    classStyles: `.tc-frame-blood{animation:tcBlood 2s ease-in-out infinite;border-width:2px!important;}`,
  },
  {
    id: 'mythic',
    label: '⭐ Mythique',
    keyframes: `@keyframes tcMythic{0%,100%{box-shadow:0 0 0 2px #9c27b0,0 0 8px #9c27b0}50%{box-shadow:0 0 0 2px #FFD700,0 0 0 4px #9c27b0,0 0 20px #e040fb}}`,
    classStyles: `.tc-frame-mythic{animation:tcMythic 2.5s alternate infinite;border:2px solid #FFD700!important;}`,
  },
  {
    id: 'chrome',
    label: '🔩 Chrome',
    keyframes: `@keyframes tcChrome{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}`,
    classStyles: `.tc-frame-chrome{background:linear-gradient(135deg,#666,#bbb,#888,#ddd,#888,#bbb,#666)!important;background-size:300% 100%!important;animation:tcChrome 3s linear infinite;color:#000!important;border:1px solid #aaa!important;}`,
  },
  {
    id: 'wings',
    label: '🪶 Ailes',
    classStyles: `.tc-frame-wings{border:1px solid rgba(255,255,255,.6)!important;box-shadow:0 0 8px rgba(255,255,255,.4);}`,
  },
  {
    id: 'circus',
    label: '🎪 Cirque',
    keyframes: `@keyframes tcCircus{0%{border-color:#ff1744;box-shadow:0 0 6px #ff1744}25%{border-color:#FFD700;box-shadow:0 0 6px #FFD700}50%{border-color:#00e5ff;box-shadow:0 0 6px #00e5ff}75%{border-color:#e040fb;box-shadow:0 0 6px #e040fb}100%{border-color:#ff1744;box-shadow:0 0 6px #ff1744}}`,
    classStyles: `.tc-frame-circus{animation:tcCircus 1s linear infinite;border-width:2px!important;}`,
  },
  {
    id: 'void',
    label: '🌑 Vide',
    keyframes: `@keyframes tcVoid{0%,100%{box-shadow:0 0 0 1px #333,0 0 15px rgba(0,0,0,.9)}50%{box-shadow:0 0 0 1px #111,0 0 30px rgba(0,0,0,.95)}}`,
    classStyles: `.tc-frame-void{background:#000!important;border:1px solid #333!important;color:#555!important;animation:tcVoid 3s ease-in-out infinite;}`,
  },
  // ── Ajoutez de nouvelles frames ici ──
]

// ─── GÉNÉRATEUR CSS ───────────────────────────────────────────────────────────
export function generateBadgeCSS(): string {
  const parts: string[] = []

  parts.push(`
.tc-badge{display:inline-block;padding:2px 8px;border-radius:3px;font-size:.68rem;font-weight:800;text-transform:uppercase;letter-spacing:1px;position:relative;overflow:hidden;cursor:default;white-space:nowrap;transition:transform .1s,filter .1s;user-select:none;vertical-align:middle;}
.tc-badge:hover{transform:translateY(-1px);filter:brightness(1.15);}
.tc-badge-sm{font-size:.6rem;padding:1px 6px;}
.tc-badge-md{font-size:.72rem;padding:3px 10px;}
.tc-badge-lg{font-size:.85rem;padding:4px 14px;border-radius:4px;}

/* ── Couleurs standard ── */
.tc-badge-gold{background:#FFD70015;border:1px solid #FFD700;color:#FFD700;}
.tc-badge-red{background:#f4433615;border:1px solid #f44336;color:#f44336;}
.tc-badge-blue{background:#2196F315;border:1px solid #2196F3;color:#2196F3;}
.tc-badge-green{background:#4CAF5015;border:1px solid #4CAF50;color:#4CAF50;}
.tc-badge-purple{background:#9c27b015;border:1px solid #9c27b0;color:#9c27b0;}
.tc-badge-cyan{background:#00bcd415;border:1px solid #00bcd4;color:#00bcd4;}
.tc-badge-pink{background:#E91E6315;border:1px solid #E91E63;color:#E91E63;}
.tc-badge-orange{background:#FF980015;border:1px solid #FF9800;color:#FF9800;}
.tc-badge-lime{background:#8BC34A15;border:1px solid #8BC34A;color:#8BC34A;}
.tc-badge-black{background:#21212180;border:1px solid #555;color:#ccc;}
.tc-badge-white{background:#f5f5f515;border:1px solid #ddd;color:#e0e0e0;}
.tc-badge-crimson{background:#dc143c15;border:1px solid #dc143c;color:#dc143c;}
.tc-badge-midnight{background:#1a237e30;border:1px solid #3949ab;color:#7986cb;}
.tc-badge-toxic{background:rgba(0,100,0,.15);border:1px solid #39ff14;color:#39ff14;text-shadow:0 0 6px #39ff14;}

/* ── Couleurs spéciales avec animations ── */
@keyframes tcGradMove{0%{background-position:0% 50%}100%{background-position:200% 50%}}
@keyframes tcGradMoveAlt{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
@keyframes tcDiamond{0%,100%{filter:brightness(1) hue-rotate(0deg)}50%{filter:brightness(1.4) hue-rotate(15deg)}}
@keyframes tcMagma{0%,100%{background-position:0% 50%;box-shadow:0 0 8px #ff4500}50%{background-position:100% 50%;box-shadow:0 0 16px #ff0000}}

.tc-badge-realgold{background:linear-gradient(135deg,#BF953F,#FCF6BA,#B38728,#FBF5B7,#AA771C,#FCF6BA);background-size:300% 300%;animation:tcGradMove 3s linear infinite;color:#000;border:1px solid #B8860B;font-weight:900;text-shadow:0 1px 2px rgba(255,255,255,.4);}
.tc-badge-realsilver{background:linear-gradient(135deg,#808080,#d4d4d4,#a0a0a0,#e8e8e8,#808080);background-size:300% 300%;animation:tcGradMove 4s linear infinite;color:#000;border:1px solid #999;}
.tc-badge-realdiamond{background:linear-gradient(135deg,#0097a7,#00e5ff,#80d8ff,#00bcd4);background-size:200% 200%;animation:tcDiamond 2s ease-in-out infinite,tcGradMove 6s linear infinite;color:#fff;border:1px solid #00e5ff;text-shadow:0 0 6px #00e5ff;}
.tc-badge-galaxy{background:linear-gradient(135deg,#1a0533,#4a148c,#6a1b9a,#ad1457,#880e4f,#4a148c,#1a0533);background-size:300% 300%;animation:tcGradMoveAlt 5s ease infinite;color:#e040fb;border:1px solid #7b1fa2;text-shadow:0 0 8px #e040fb;}
.tc-badge-magma{background:linear-gradient(135deg,#b71c1c,#e64a19,#ff6d00,#e64a19,#b71c1c);background-size:300% 300%;animation:tcMagma 3s ease infinite;color:#fff;border:1px solid #d50000;}
.tc-badge-obsidian{background:linear-gradient(135deg,#090909,#1a0a2e,#0d0d0d);color:#ce93d8;border:1px solid #7b1fa2;box-shadow:0 0 6px rgba(156,39,176,.4);}
.tc-badge-ice{background:linear-gradient(135deg,#b3e5fc,#e1f5fe,#81d4fa);color:#01579b;border:1px solid #81d4fa;}
.tc-badge-horror{background:#0a0000;color:#c62828;border:1px solid #b71c1c;text-shadow:0 0 4px #f44336;}
.tc-badge-pigeon{background:linear-gradient(135deg,#616161,#9e9e9e,#757575);color:#fff;border:1px solid #757575;}
.tc-badge-clown{background:repeating-linear-gradient(45deg,#ff1744 0px,#ff1744 4px,#FFD700 4px,#FFD700 8px);color:#fff;border:2px solid #ff6d00;text-shadow:1px 1px 0 #000;}
.tc-badge-sunset{background:linear-gradient(135deg,#ff6b35,#f7c59f,#ff6b35);background-size:200% 100%;animation:tcGradMove 4s linear infinite;color:#fff;border:1px solid #ff4500;}
  `)

  BADGE_EFFECTS.forEach(e => { parts.push(e.keyframes); parts.push(e.classStyles) })
  BADGE_FRAMES.forEach(f => { if (f.keyframes) parts.push(f.keyframes); parts.push(f.classStyles) })

  return parts.join('\n')
}
