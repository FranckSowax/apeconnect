-- APE Connect - Système de Discussions par Classe
-- Migration 00011

-- ===========================================
-- ENUM TYPES
-- ===========================================

CREATE TYPE auteur_type AS ENUM ('PARENT', 'PROFESSEUR', 'ADMIN', 'SYSTEM');
CREATE TYPE message_type AS ENUM ('TEXT', 'IMAGE', 'ANNONCE');

-- ===========================================
-- TABLES PRINCIPALES
-- ===========================================

-- Table des classes
CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom TEXT NOT NULL,
  niveau TEXT,
  annee_scolaire TEXT NOT NULL DEFAULT '2024-2025',
  establishment_id UUID REFERENCES establishments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des professeurs
CREATE TABLE professeurs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  email TEXT,
  whatsapp TEXT,
  matiere TEXT,
  establishment_id UUID REFERENCES establishments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table de liaison professeurs-classes
CREATE TABLE professeurs_classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  professeur_id UUID REFERENCES professeurs(id) ON DELETE CASCADE,
  classe_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  is_principal BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(professeur_id, classe_id)
);

-- Ajouter classe_id à la table students existante
ALTER TABLE students ADD COLUMN IF NOT EXISTS classe_id UUID REFERENCES classes(id) ON DELETE SET NULL;

-- Ajouter is_admin_ape et notif_whatsapp à la table users
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin_ape BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS notif_whatsapp BOOLEAN DEFAULT TRUE;

-- Table des groupes de discussion
CREATE TABLE groupes_discussion (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  classe_id UUID REFERENCES classes(id) ON DELETE CASCADE UNIQUE,
  nom TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  establishment_id UUID REFERENCES establishments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des messages
CREATE TABLE messages_discussion (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  groupe_id UUID REFERENCES groupes_discussion(id) ON DELETE CASCADE NOT NULL,
  auteur_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  auteur_type auteur_type NOT NULL DEFAULT 'PARENT',
  contenu TEXT NOT NULL,
  type_message message_type DEFAULT 'TEXT',
  is_annonce BOOLEAN DEFAULT FALSE,
  is_moderated BOOLEAN DEFAULT FALSE,
  moderation_reason TEXT,
  reply_to UUID REFERENCES messages_discussion(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table pour tracker les messages lus
CREATE TABLE message_reads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  groupe_id UUID REFERENCES groupes_discussion(id) ON DELETE CASCADE NOT NULL,
  last_read_at TIMESTAMPTZ DEFAULT NOW(),
  last_read_message_id UUID REFERENCES messages_discussion(id) ON DELETE SET NULL,
  UNIQUE(user_id, groupe_id)
);

-- Table des notifications de discussion
CREATE TABLE notifications_discussion (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL DEFAULT 'NEW_MESSAGE',
  titre TEXT NOT NULL,
  contenu TEXT,
  lien TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  groupe_id UUID REFERENCES groupes_discussion(id) ON DELETE CASCADE,
  message_id UUID REFERENCES messages_discussion(id) ON DELETE CASCADE,
  sent_whatsapp BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- INDEX POUR PERFORMANCE
-- ===========================================

CREATE INDEX idx_classes_establishment ON classes(establishment_id);
CREATE INDEX idx_classes_annee ON classes(annee_scolaire);
CREATE INDEX idx_professeurs_user ON professeurs(user_id);
CREATE INDEX idx_professeurs_establishment ON professeurs(establishment_id);
CREATE INDEX idx_professeurs_classes_prof ON professeurs_classes(professeur_id);
CREATE INDEX idx_professeurs_classes_classe ON professeurs_classes(classe_id);
CREATE INDEX idx_students_classe ON students(classe_id);
CREATE INDEX idx_groupes_classe ON groupes_discussion(classe_id);
CREATE INDEX idx_groupes_establishment ON groupes_discussion(establishment_id);
CREATE INDEX idx_messages_groupe ON messages_discussion(groupe_id);
CREATE INDEX idx_messages_auteur ON messages_discussion(auteur_id);
CREATE INDEX idx_messages_created ON messages_discussion(created_at DESC);
CREATE INDEX idx_messages_annonce ON messages_discussion(is_annonce) WHERE is_annonce = TRUE;
CREATE INDEX idx_message_reads_user ON message_reads(user_id);
CREATE INDEX idx_message_reads_groupe ON message_reads(groupe_id);
CREATE INDEX idx_notifications_disc_user ON notifications_discussion(user_id);
CREATE INDEX idx_notifications_disc_read ON notifications_discussion(is_read);
CREATE INDEX idx_notifications_disc_groupe ON notifications_discussion(groupe_id);

-- ===========================================
-- TRIGGERS updated_at
-- ===========================================

CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON classes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_professeurs_updated_at BEFORE UPDATE ON professeurs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_groupes_discussion_updated_at BEFORE UPDATE ON groupes_discussion
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_discussion_updated_at BEFORE UPDATE ON messages_discussion
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- FONCTIONS HELPER
-- ===========================================

-- Fonction: Récupérer les classes des enfants d'un parent
CREATE OR REPLACE FUNCTION get_parent_classes(p_user_id UUID)
RETURNS TABLE(classe_id UUID) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT s.classe_id
  FROM students s
  WHERE s.parent_id = p_user_id
    AND s.classe_id IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Fonction: Récupérer les classes d'un professeur
CREATE OR REPLACE FUNCTION get_professeur_classes(p_user_id UUID)
RETURNS TABLE(classe_id UUID) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT pc.classe_id
  FROM professeurs_classes pc
  JOIN professeurs p ON p.id = pc.professeur_id
  WHERE p.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Fonction: Vérifier si un utilisateur est admin APE
CREATE OR REPLACE FUNCTION is_admin_ape(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_is_admin BOOLEAN;
  v_role user_role;
BEGIN
  SELECT is_admin_ape, role INTO v_is_admin, v_role
  FROM users
  WHERE id = p_user_id;

  RETURN COALESCE(v_is_admin, FALSE) OR v_role IN ('admin', 'super_admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Fonction: Vérifier si un utilisateur est professeur
CREATE OR REPLACE FUNCTION is_professeur(p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM professeurs WHERE user_id = p_user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Fonction: Récupérer toutes les classes accessibles par un utilisateur
CREATE OR REPLACE FUNCTION get_user_accessible_classes(p_user_id UUID)
RETURNS TABLE(classe_id UUID) AS $$
BEGIN
  -- Si admin APE, retourner toutes les classes de son établissement
  IF is_admin_ape(p_user_id) THEN
    RETURN QUERY
    SELECT c.id
    FROM classes c
    JOIN users u ON u.establishment_id = c.establishment_id
    WHERE u.id = p_user_id;
  ELSE
    -- Combiner les classes parent + professeur
    RETURN QUERY
    SELECT * FROM get_parent_classes(p_user_id)
    UNION
    SELECT * FROM get_professeur_classes(p_user_id);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Fonction: Récupérer les groupes avec compteur de messages non lus
CREATE OR REPLACE FUNCTION get_user_groupes_with_unread(p_user_id UUID)
RETURNS TABLE(
  groupe_id UUID,
  groupe_nom TEXT,
  classe_nom TEXT,
  classe_niveau TEXT,
  description TEXT,
  last_message_at TIMESTAMPTZ,
  last_message_preview TEXT,
  last_message_auteur TEXT,
  unread_count BIGINT,
  total_members BIGINT
) AS $$
BEGIN
  RETURN QUERY
  WITH accessible_classes AS (
    SELECT * FROM get_user_accessible_classes(p_user_id)
  ),
  last_messages AS (
    SELECT DISTINCT ON (m.groupe_id)
      m.groupe_id,
      m.created_at,
      LEFT(m.contenu, 50) as preview,
      COALESCE(u.full_name, 'Système') as auteur_nom
    FROM messages_discussion m
    LEFT JOIN users u ON u.id = m.auteur_id
    ORDER BY m.groupe_id, m.created_at DESC
  ),
  unread_counts AS (
    SELECT
      m.groupe_id,
      COUNT(*) as cnt
    FROM messages_discussion m
    LEFT JOIN message_reads mr ON mr.groupe_id = m.groupe_id AND mr.user_id = p_user_id
    WHERE m.created_at > COALESCE(mr.last_read_at, '1970-01-01'::timestamptz)
      AND m.auteur_id != p_user_id
    GROUP BY m.groupe_id
  ),
  member_counts AS (
    SELECT
      g.id as groupe_id,
      (
        SELECT COUNT(DISTINCT s.parent_id)
        FROM students s
        WHERE s.classe_id = g.classe_id AND s.parent_id IS NOT NULL
      ) + (
        SELECT COUNT(DISTINCT pc.professeur_id)
        FROM professeurs_classes pc
        WHERE pc.classe_id = g.classe_id
      ) as total
    FROM groupes_discussion g
  )
  SELECT
    g.id,
    g.nom,
    c.nom,
    c.niveau,
    g.description,
    lm.created_at,
    lm.preview,
    lm.auteur_nom,
    COALESCE(uc.cnt, 0),
    COALESCE(mc.total, 0)
  FROM groupes_discussion g
  JOIN classes c ON c.id = g.classe_id
  JOIN accessible_classes ac ON ac.classe_id = g.classe_id
  LEFT JOIN last_messages lm ON lm.groupe_id = g.id
  LEFT JOIN unread_counts uc ON uc.groupe_id = g.id
  LEFT JOIN member_counts mc ON mc.groupe_id = g.id
  WHERE g.is_active = TRUE
  ORDER BY lm.created_at DESC NULLS LAST;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Fonction: Récupérer le total de messages non lus pour un utilisateur
CREATE OR REPLACE FUNCTION get_total_unread_count(p_user_id UUID)
RETURNS BIGINT AS $$
DECLARE
  v_count BIGINT;
BEGIN
  SELECT COALESCE(SUM(unread_count), 0) INTO v_count
  FROM get_user_groupes_with_unread(p_user_id);

  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Fonction: Récupérer les membres d'un groupe
CREATE OR REPLACE FUNCTION get_groupe_members(p_groupe_id UUID)
RETURNS TABLE(
  user_id UUID,
  full_name TEXT,
  avatar_url TEXT,
  member_type TEXT,
  is_principal BOOLEAN,
  children_count BIGINT
) AS $$
DECLARE
  v_classe_id UUID;
BEGIN
  -- Récupérer la classe associée au groupe
  SELECT classe_id INTO v_classe_id
  FROM groupes_discussion
  WHERE id = p_groupe_id;

  -- Retourner les professeurs
  RETURN QUERY
  SELECT
    p.user_id,
    CONCAT(p.prenom, ' ', p.nom)::TEXT as full_name,
    u.avatar_url,
    'PROFESSEUR'::TEXT as member_type,
    pc.is_principal,
    0::BIGINT as children_count
  FROM professeurs_classes pc
  JOIN professeurs p ON p.id = pc.professeur_id
  LEFT JOIN users u ON u.id = p.user_id
  WHERE pc.classe_id = v_classe_id;

  -- Retourner les parents
  RETURN QUERY
  SELECT
    s.parent_id as user_id,
    u.full_name,
    u.avatar_url,
    'PARENT'::TEXT as member_type,
    FALSE as is_principal,
    COUNT(*)::BIGINT as children_count
  FROM students s
  JOIN users u ON u.id = s.parent_id
  WHERE s.classe_id = v_classe_id
    AND s.parent_id IS NOT NULL
  GROUP BY s.parent_id, u.full_name, u.avatar_url;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Fonction: Vérifier si un utilisateur peut accéder à un groupe
CREATE OR REPLACE FUNCTION can_access_groupe(p_user_id UUID, p_groupe_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_classe_id UUID;
BEGIN
  SELECT classe_id INTO v_classe_id
  FROM groupes_discussion
  WHERE id = p_groupe_id;

  RETURN v_classe_id IN (SELECT * FROM get_user_accessible_classes(p_user_id));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Fonction: Déterminer le type d'auteur
CREATE OR REPLACE FUNCTION get_auteur_type(p_user_id UUID)
RETURNS auteur_type AS $$
BEGIN
  IF is_admin_ape(p_user_id) THEN
    RETURN 'ADMIN';
  ELSIF is_professeur(p_user_id) THEN
    RETURN 'PROFESSEUR';
  ELSE
    RETURN 'PARENT';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ===========================================
-- POLITIQUES RLS
-- ===========================================

-- Activer RLS sur toutes les tables
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE professeurs ENABLE ROW LEVEL SECURITY;
ALTER TABLE professeurs_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE groupes_discussion ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages_discussion ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_reads ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications_discussion ENABLE ROW LEVEL SECURITY;

-- Politiques pour classes
CREATE POLICY "Classes visibles selon établissement" ON classes
  FOR SELECT USING (
    establishment_id IN (
      SELECT establishment_id FROM users WHERE id = auth.uid()
    )
  );

-- Politiques pour professeurs
CREATE POLICY "Professeurs visibles selon établissement" ON professeurs
  FOR SELECT USING (
    establishment_id IN (
      SELECT establishment_id FROM users WHERE id = auth.uid()
    )
  );

-- Politiques pour professeurs_classes
CREATE POLICY "Liaisons prof-classe visibles" ON professeurs_classes
  FOR SELECT USING (
    classe_id IN (SELECT * FROM get_user_accessible_classes(auth.uid()))
    OR is_admin_ape(auth.uid())
  );

-- Politiques pour groupes_discussion
CREATE POLICY "Groupes visibles selon classes accessibles" ON groupes_discussion
  FOR SELECT USING (
    classe_id IN (SELECT * FROM get_user_accessible_classes(auth.uid()))
  );

-- Politiques pour messages_discussion
CREATE POLICY "Messages visibles dans groupes accessibles" ON messages_discussion
  FOR SELECT USING (
    can_access_groupe(auth.uid(), groupe_id)
  );

CREATE POLICY "Insertion messages dans groupes accessibles" ON messages_discussion
  FOR INSERT WITH CHECK (
    can_access_groupe(auth.uid(), groupe_id)
    AND auteur_id = auth.uid()
  );

CREATE POLICY "Modification propres messages récents" ON messages_discussion
  FOR UPDATE USING (
    auteur_id = auth.uid()
    AND created_at > NOW() - INTERVAL '15 minutes'
  );

CREATE POLICY "Suppression propres messages ou admin" ON messages_discussion
  FOR DELETE USING (
    auteur_id = auth.uid()
    OR is_admin_ape(auth.uid())
  );

-- Politiques pour message_reads
CREATE POLICY "Lecture propres statuts" ON message_reads
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Insertion propre statut" ON message_reads
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Modification propre statut" ON message_reads
  FOR UPDATE USING (user_id = auth.uid());

-- Politiques pour notifications_discussion
CREATE POLICY "Notifications visibles propres" ON notifications_discussion
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Modification propres notifications" ON notifications_discussion
  FOR UPDATE USING (user_id = auth.uid());

-- ===========================================
-- TRIGGER: Notifications sur nouveau message
-- ===========================================

CREATE OR REPLACE FUNCTION on_new_message()
RETURNS TRIGGER AS $$
DECLARE
  v_groupe_nom TEXT;
  v_auteur_nom TEXT;
  v_membre RECORD;
BEGIN
  -- Récupérer le nom du groupe
  SELECT nom INTO v_groupe_nom
  FROM groupes_discussion
  WHERE id = NEW.groupe_id;

  -- Récupérer le nom de l'auteur
  SELECT full_name INTO v_auteur_nom
  FROM users
  WHERE id = NEW.auteur_id;

  -- Créer une notification pour chaque membre du groupe (sauf l'auteur)
  FOR v_membre IN
    SELECT DISTINCT user_id FROM get_groupe_members(NEW.groupe_id)
    WHERE user_id IS NOT NULL AND user_id != NEW.auteur_id
  LOOP
    INSERT INTO notifications_discussion (
      user_id,
      type,
      titre,
      contenu,
      lien,
      groupe_id,
      message_id
    ) VALUES (
      v_membre.user_id,
      CASE WHEN NEW.is_annonce THEN 'ANNONCE' ELSE 'NEW_MESSAGE' END,
      CASE WHEN NEW.is_annonce
        THEN '📢 Annonce - ' || v_groupe_nom
        ELSE 'Nouveau message - ' || v_groupe_nom
      END,
      v_auteur_nom || ': ' || LEFT(NEW.contenu, 100),
      '/discussions/' || NEW.groupe_id,
      NEW.groupe_id,
      NEW.id
    );
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_on_new_message
  AFTER INSERT ON messages_discussion
  FOR EACH ROW
  EXECUTE FUNCTION on_new_message();

-- ===========================================
-- TRIGGER: Appeler Edge Function pour WhatsApp sur annonce
-- ===========================================

CREATE OR REPLACE FUNCTION notify_whatsapp_on_annonce()
RETURNS TRIGGER AS $$
BEGIN
  -- Appeler l'Edge Function via pg_net si c'est une annonce
  IF NEW.is_annonce = TRUE THEN
    PERFORM net.http_post(
      url := current_setting('app.settings.supabase_url') || '/functions/v1/send-whatsapp-notification',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
      ),
      body := jsonb_build_object(
        'message_id', NEW.id,
        'groupe_id', NEW.groupe_id,
        'contenu', NEW.contenu,
        'auteur_id', NEW.auteur_id
      )
    );
  END IF;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Ne pas bloquer l'insertion si la notification échoue
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: Le trigger WhatsApp nécessite pg_net qui doit être activé manuellement
-- CREATE TRIGGER trigger_whatsapp_annonce
--   AFTER INSERT ON messages_discussion
--   FOR EACH ROW
--   WHEN (NEW.is_annonce = TRUE)
--   EXECUTE FUNCTION notify_whatsapp_on_annonce();

-- ===========================================
-- FONCTION: Créer automatiquement un groupe pour une nouvelle classe
-- ===========================================

CREATE OR REPLACE FUNCTION create_groupe_for_classe()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO groupes_discussion (classe_id, nom, description, establishment_id)
  VALUES (
    NEW.id,
    'Groupe ' || NEW.nom,
    'Groupe de discussion pour la classe ' || NEW.nom,
    NEW.establishment_id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_create_groupe_for_classe
  AFTER INSERT ON classes
  FOR EACH ROW
  EXECUTE FUNCTION create_groupe_for_classe();
