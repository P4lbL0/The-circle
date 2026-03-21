-- Migration : RLS pour la Forge de badges — accès owner + modérateurs
-- À exécuter dans : Supabase Dashboard → SQL Editor

-- ─────────────────────────────────────────────────────────────
-- Politique UPDATE sur community_members
-- Permet à l'owner de la communauté ET aux modérateurs de
-- mettre à jour badges, points, custom_stats, role, is_public
-- des membres (hors le role 'owner' qui reste protégé).
-- ─────────────────────────────────────────────────────────────

-- Supprimer l'ancienne politique d'update si elle existe
DROP POLICY IF EXISTS "owners can update members" ON community_members;
DROP POLICY IF EXISTS "owner can update members"  ON community_members;
DROP POLICY IF EXISTS "moderators can update members" ON community_members;

-- Nouvelle politique unifiée : owner de la communauté OU modérateur actif
CREATE POLICY "owner_or_moderator_can_update_members"
ON community_members
FOR UPDATE
USING (
  -- L'utilisateur est l'owner de la communauté
  EXISTS (
    SELECT 1 FROM communities
    WHERE communities.id = community_members.community_id
      AND communities.owner_id = auth.uid()
  )
  OR
  -- L'utilisateur est modérateur actif dans cette communauté
  EXISTS (
    SELECT 1 FROM community_members AS cm
    WHERE cm.community_id = community_members.community_id
      AND cm.profile_id   = auth.uid()
      AND cm.role         = 'moderator'
  )
)
WITH CHECK (
  -- Même condition pour WITH CHECK
  EXISTS (
    SELECT 1 FROM communities
    WHERE communities.id = community_members.community_id
      AND communities.owner_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM community_members AS cm
    WHERE cm.community_id = community_members.community_id
      AND cm.profile_id   = auth.uid()
      AND cm.role         = 'moderator'
  )
);

-- ─────────────────────────────────────────────────────────────
-- SELECT sur community_members : lecture publique des membres
-- publics (pour la page Dossier Soldat accessible sans login)
-- ─────────────────────────────────────────────────────────────

-- Vérifier qu'une politique SELECT permissive existe
-- (la plupart des projets Supabase l'ont déjà, cette policy est additive)
DROP POLICY IF EXISTS "public members are readable" ON community_members;

CREATE POLICY "public_members_readable"
ON community_members
FOR SELECT
USING (
  -- Membre public dans une communauté publique
  (
    is_public = true
    AND EXISTS (
      SELECT 1 FROM communities
      WHERE communities.id = community_members.community_id
        AND communities.privacy = 'public'
    )
  )
  OR
  -- Ou l'utilisateur est membre/owner/moderator de la communauté
  EXISTS (
    SELECT 1 FROM community_members AS cm
    WHERE cm.community_id = community_members.community_id
      AND cm.profile_id   = auth.uid()
      AND cm.role IN ('owner', 'moderator', 'member')
  )
  OR
  -- Ou l'utilisateur est l'owner de la communauté
  EXISTS (
    SELECT 1 FROM communities
    WHERE communities.id = community_members.community_id
      AND communities.owner_id = auth.uid()
  )
);
