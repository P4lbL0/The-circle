-- ── Annonces (community_id = NULL → annonce globale du superadmin) ──────────
CREATE TABLE IF NOT EXISTS announcements (
  id           uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid         REFERENCES communities(id) ON DELETE CASCADE,
  author_id    uuid         REFERENCES profiles(id) ON DELETE SET NULL,
  title        text         NOT NULL,
  content      text         NOT NULL,
  type         text         DEFAULT 'info' CHECK (type IN ('info', 'warning', 'alert')),
  created_at   timestamptz  DEFAULT now()
);

-- ── Suivi de lecture par profil ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS announcement_reads (
  announcement_id uuid  REFERENCES announcements(id) ON DELETE CASCADE,
  profile_id      uuid  REFERENCES profiles(id) ON DELETE CASCADE,
  read_at         timestamptz DEFAULT now(),
  PRIMARY KEY (announcement_id, profile_id)
);

-- ── RLS ─────────────────────────────────────────────────────────────────────
ALTER TABLE announcements       ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcement_reads  ENABLE ROW LEVEL SECURITY;

-- Lecture : annonces globales (community_id IS NULL) visibles par tous les connectés
-- Annonces communauté : visibles par membres actifs de la communauté
CREATE POLICY "announcements_select" ON announcements FOR SELECT
  USING (
    community_id IS NULL
    OR community_id IN (
      SELECT community_id FROM community_members
      WHERE profile_id = auth.uid()
        AND role IN ('owner','moderator','member')
    )
  );

-- Insertion : superadmin (global) OU owner/modérateur (communauté)
CREATE POLICY "announcements_insert" ON announcements FOR INSERT
  WITH CHECK (
    (
      community_id IS NULL
      AND EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND global_role = 'super_admin'
      )
    )
    OR (
      community_id IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM community_members
        WHERE profile_id = auth.uid()
          AND community_id = announcements.community_id
          AND role IN ('owner','moderator')
      )
    )
  );

-- Suppression : mêmes conditions que l'insertion
CREATE POLICY "announcements_delete" ON announcements FOR DELETE
  USING (
    (
      community_id IS NULL
      AND EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND global_role = 'super_admin'
      )
    )
    OR (
      community_id IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM community_members
        WHERE profile_id = auth.uid()
          AND community_id = announcements.community_id
          AND role IN ('owner','moderator')
      )
    )
  );

-- Reads : chaque user peut lire/écrire ses propres entrées
CREATE POLICY "announcement_reads_own" ON announcement_reads FOR ALL
  USING   (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());
