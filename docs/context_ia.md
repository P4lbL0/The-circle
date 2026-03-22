# The Circle — Contexte IA

> Colle ce fichier en début de conversation pour donner le contexte complet du projet.
> Dernière mise à jour : 23/03/2026

---

## C'est quoi

**The Circle** — SaaS multi-tenant : n'importe qui peut créer sa communauté en ligne (clan gaming, équipe sport, classe, asso) et la personnaliser sans coder.

- **Owner** = créateur/admin d'une communauté
- **Membre** = utilisateur qui rejoint via lien d'invitation
- **Superadmin** = admin global de la plateforme (moi)

---

## Stack

| Quoi | Détail |
|---|---|
| **Next.js 15** | App Router, Turbopack, SSR |
| **Supabase** | PostgreSQL + Auth + Storage + RLS |
| **Resend** | Emails transactionnels (`noreply@the-circle.pro`) |
| **Vercel** | Déploiement — `https://the-circle-self.vercel.app` |
| **Tailwind CSS** | Dashboard/auth uniquement |
| **Inline CSS** | Pages vitrine/publiques (respect du thème custom) |
| **Stripe** | Paiements — **pas encore intégré** |

---

## Routes principales

```
/                        → Landing page marketing
/login  /signup          → Auth
/onboarding              → Wizard création communauté (5 étapes)
/dashboard/[slug]        → Dashboard owner (12 sections)
/c/[slug]                → Vitrine publique de la communauté
/join/[slug]             → Page invitation membres (magic link via Resend)
/account                 → Compte utilisateur (export données, suppression)
/superadmin              → Panel admin global
```

---

## Base de données (tables clés)

```
profiles             → id, email, display_name, avatar_url, global_role
communities          → owner_id, name, slug, theme_json, subscription_tier (free/starter/pro)
community_members    → community_id, profile_id, role, points, badges, custom_stats
features             → community_id, module, enabled, visibility
stat_schemas         → community_id, fields jsonb, formula_config jsonb
events / event_rsvps → Événements + RSVP
tournaments / tournament_participants
bets / bet_entries   → Paris internes
shop_items / shop_orders
forum_categories / forum_threads / forum_posts
applications / application_forms
announcements        → Annonces admin/superadmin
```

---

## Modules disponibles par communauté

`scores` · `calendar` · `applications` · `tournaments` · `bets` · `shop` · `forum`

Chaque module a un toggle `enabled` + visibilité `public/members_only`.

---

## Auth flow

- **Inscription** → `/api/auth/signup` (serveur) → `admin.generateLink()` Supabase → email via Resend → `/auth/confirm?token_hash=...&type=signup`
- **Rejoindre communauté** → `/join/[slug]` → `/api/auth/magic-link` → email via Resend → `/auth/confirm?token_hash=...&type=magiclink`
- **Confirmation** → `src/app/auth/confirm/page.tsx` → `verifyOtp()` → redirect
- **Protection routes** → `src/proxy.ts` : dashboard bloqué si non connecté OU email non confirmé

---

## Conventions code

- **Styles** : inline CSS sur les pages vitrine (thème custom), Tailwind sur dashboard/auth
- **Pattern** : `page.tsx` = server component qui fetch → passe en props à `XClient.tsx` (client)
- **Supabase client** : `@/lib/supabase/client` côté client, `@/lib/supabase/server` côté serveur
- **Emails** : toujours via `src/lib/email.ts` (Resend), jamais via Supabase natif
- **Sécurité** : formules de score via `src/lib/safe-eval.ts` (pas d'eval)
- **Palette dashboard** : bg `#0a0a0a`, panels `#141414`, accent `#FFC107`, danger `#FF2344`

---

## État actuel (23/03/2026)

**Fait ✅**
- Auth complète (signup/login/magic link) via Resend
- Onboarding 5 étapes (création communauté en transaction RPC PostgreSQL)
- Dashboard owner : membres, stats, badges, modules, apparence, événements, tournois, paris, forum, boutique, candidatures, annonces
- Vitrine publique + leaderboard + tous les modules
- Emails transactionnels Resend (confirmation, magic link, candidature, bienvenue)
- Page `/account` : export données RGPD + suppression compte
- Sécurité : RLS, safe-eval, token UUID, middleware email confirmé, CASCADE DELETE

**À faire ❌**
- Stripe billing (priorité critique)
- Analytics charts (Chart.js)
- Community discovery `/explore`
- 2 migrations SQL à appliquer dans Supabase : `20260322_cascade_delete_community.sql` + `20260322_rpc_create_community.sql`

---

## Variables d'env

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY     ← serveur uniquement
RESEND_API_KEY
NEXT_PUBLIC_APP_URL           ← https://the-circle-self.vercel.app
STRIPE_SECRET_KEY             ← pas encore utilisé
```
