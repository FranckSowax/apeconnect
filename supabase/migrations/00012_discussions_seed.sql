-- APE Connect - Seed Data pour le système de Discussions
-- Migration 00012 - À exécuter après 00011_discussions_system.sql
-- IMPORTANT: Ce fichier contient des données de test, à utiliser uniquement en développement

-- Récupérer l'établissement existant (on suppose qu'il en existe au moins un)
DO $$
DECLARE
  v_establishment_id UUID;
  v_classe_6a_id UUID;
  v_classe_6b_id UUID;
  v_classe_3b_id UUID;
  v_prof1_id UUID;
  v_prof2_id UUID;
  v_prof3_id UUID;
  v_groupe_6a_id UUID;
  v_groupe_6b_id UUID;
  v_groupe_3b_id UUID;
  v_parent1_id UUID;
  v_parent2_id UUID;
  v_parent3_id UUID;
  v_parent4_id UUID;
  v_parent5_id UUID;
BEGIN
  -- Récupérer le premier établissement
  SELECT id INTO v_establishment_id FROM establishments LIMIT 1;

  -- Si aucun établissement n'existe, en créer un
  IF v_establishment_id IS NULL THEN
    INSERT INTO establishments (name, address, phone, email)
    VALUES ('Lycée National Léon Mba', 'Boulevard Triomphal, Libreville', '+241 01 72 00 00', 'contact@lnlm.ga')
    RETURNING id INTO v_establishment_id;
  END IF;

  -- ===========================================
  -- CRÉER LES CLASSES
  -- ===========================================

  INSERT INTO classes (nom, niveau, annee_scolaire, establishment_id)
  VALUES ('6ème A', 'Collège', '2024-2025', v_establishment_id)
  RETURNING id INTO v_classe_6a_id;

  INSERT INTO classes (nom, niveau, annee_scolaire, establishment_id)
  VALUES ('6ème B', 'Collège', '2024-2025', v_establishment_id)
  RETURNING id INTO v_classe_6b_id;

  INSERT INTO classes (nom, niveau, annee_scolaire, establishment_id)
  VALUES ('3ème B', 'Collège', '2024-2025', v_establishment_id)
  RETURNING id INTO v_classe_3b_id;

  -- Les groupes de discussion sont créés automatiquement par le trigger
  -- Récupérer leurs IDs
  SELECT id INTO v_groupe_6a_id FROM groupes_discussion WHERE classe_id = v_classe_6a_id;
  SELECT id INTO v_groupe_6b_id FROM groupes_discussion WHERE classe_id = v_classe_6b_id;
  SELECT id INTO v_groupe_3b_id FROM groupes_discussion WHERE classe_id = v_classe_3b_id;

  -- ===========================================
  -- CRÉER LES PROFESSEURS
  -- ===========================================

  INSERT INTO professeurs (nom, prenom, email, whatsapp, matiere, establishment_id)
  VALUES ('Ondo', 'Marie-Claire', 'mc.ondo@lnlm.ga', '+24162000001', 'Français', v_establishment_id)
  RETURNING id INTO v_prof1_id;

  INSERT INTO professeurs (nom, prenom, email, whatsapp, matiere, establishment_id)
  VALUES ('Nzoghe', 'Jean-Baptiste', 'jb.nzoghe@lnlm.ga', '+24162000002', 'Mathématiques', v_establishment_id)
  RETURNING id INTO v_prof2_id;

  INSERT INTO professeurs (nom, prenom, email, whatsapp, matiere, establishment_id)
  VALUES ('Moussavou', 'Pauline', 'p.moussavou@lnlm.ga', '+24162000003', 'SVT', v_establishment_id)
  RETURNING id INTO v_prof3_id;

  -- Assigner les professeurs aux classes
  INSERT INTO professeurs_classes (professeur_id, classe_id, is_principal)
  VALUES
    (v_prof1_id, v_classe_6a_id, TRUE),  -- Prof principal 6ème A
    (v_prof2_id, v_classe_6b_id, TRUE),  -- Prof principal 6ème B
    (v_prof3_id, v_classe_3b_id, TRUE),  -- Prof principal 3ème B
    (v_prof1_id, v_classe_6b_id, FALSE), -- Prof de français aussi en 6ème B
    (v_prof2_id, v_classe_3b_id, FALSE); -- Prof de maths aussi en 3ème B

  -- ===========================================
  -- RÉCUPÉRER DES PARENTS EXISTANTS OU EN CRÉER
  -- ===========================================

  -- Récupérer les 5 premiers parents existants
  SELECT id INTO v_parent1_id FROM users WHERE role = 'parent' LIMIT 1 OFFSET 0;
  SELECT id INTO v_parent2_id FROM users WHERE role = 'parent' LIMIT 1 OFFSET 1;
  SELECT id INTO v_parent3_id FROM users WHERE role = 'parent' LIMIT 1 OFFSET 2;
  SELECT id INTO v_parent4_id FROM users WHERE role = 'parent' LIMIT 1 OFFSET 3;
  SELECT id INTO v_parent5_id FROM users WHERE role = 'parent' LIMIT 1 OFFSET 4;

  -- ===========================================
  -- METTRE À JOUR LES ÉTUDIANTS EXISTANTS AVEC DES CLASSES
  -- ===========================================

  -- Assigner les étudiants existants aux classes
  UPDATE students
  SET classe_id = v_classe_6a_id
  WHERE parent_id = v_parent1_id AND classe_id IS NULL
  LIMIT 1;

  UPDATE students
  SET classe_id = v_classe_6b_id
  WHERE parent_id = v_parent2_id AND classe_id IS NULL;

  UPDATE students
  SET classe_id = v_classe_3b_id
  WHERE parent_id = v_parent3_id AND classe_id IS NULL;

  -- ===========================================
  -- CRÉER DES MESSAGES DE TEST
  -- ===========================================

  -- Messages pour le groupe 6ème A
  IF v_groupe_6a_id IS NOT NULL THEN
    -- Message système de bienvenue
    INSERT INTO messages_discussion (groupe_id, auteur_id, auteur_type, contenu, type_message, is_annonce)
    VALUES (v_groupe_6a_id, NULL, 'SYSTEM', 'Bienvenue dans le groupe de discussion de la classe 6ème A !', 'TEXT', FALSE);

    -- Annonce du prof principal
    INSERT INTO messages_discussion (groupe_id, auteur_id, auteur_type, contenu, type_message, is_annonce)
    VALUES (v_groupe_6a_id, v_parent1_id, 'PROFESSEUR',
      'Chers parents, je vous rappelle que la réunion parents-professeurs aura lieu le 25 janvier à 17h. Votre présence est importante.',
      'ANNONCE', TRUE);

    -- Messages de parents
    IF v_parent1_id IS NOT NULL THEN
      INSERT INTO messages_discussion (groupe_id, auteur_id, auteur_type, contenu, type_message)
      VALUES (v_groupe_6a_id, v_parent1_id, 'PARENT', 'Bonjour à tous ! Quelqu''un sait si les livres de français sont disponibles à la librairie centrale ?', 'TEXT');
    END IF;

    IF v_parent2_id IS NOT NULL THEN
      INSERT INTO messages_discussion (groupe_id, auteur_id, auteur_type, contenu, type_message)
      VALUES (v_groupe_6a_id, v_parent2_id, 'PARENT', 'Oui, j''y suis passé hier. Ils ont tout en stock.', 'TEXT');
    END IF;

    IF v_parent1_id IS NOT NULL THEN
      INSERT INTO messages_discussion (groupe_id, auteur_id, auteur_type, contenu, type_message)
      VALUES (v_groupe_6a_id, v_parent1_id, 'PARENT', 'Parfait, merci pour l''info !', 'TEXT');
    END IF;

    INSERT INTO messages_discussion (groupe_id, auteur_id, auteur_type, contenu, type_message)
    VALUES (v_groupe_6a_id, v_parent3_id, 'PROFESSEUR',
      'Pour info, les devoirs de mathématiques sont à rendre pour lundi prochain. N''hésitez pas si vos enfants ont des questions.',
      'TEXT');

    IF v_parent3_id IS NOT NULL THEN
      INSERT INTO messages_discussion (groupe_id, auteur_id, auteur_type, contenu, type_message)
      VALUES (v_groupe_6a_id, v_parent3_id, 'PARENT', 'Est-ce que quelqu''un aurait le numéro de la cantine pour les inscriptions ?', 'TEXT');
    END IF;

    IF v_parent4_id IS NOT NULL THEN
      INSERT INTO messages_discussion (groupe_id, auteur_id, auteur_type, contenu, type_message)
      VALUES (v_groupe_6a_id, v_parent4_id, 'PARENT', 'C''est le 01 72 00 15, ils répondent entre 8h et 16h.', 'TEXT');
    END IF;

    IF v_parent3_id IS NOT NULL THEN
      INSERT INTO messages_discussion (groupe_id, auteur_id, auteur_type, contenu, type_message)
      VALUES (v_groupe_6a_id, v_parent3_id, 'PARENT', 'Super, merci beaucoup ! 🙏', 'TEXT');
    END IF;
  END IF;

  -- Messages pour le groupe 6ème B
  IF v_groupe_6b_id IS NOT NULL THEN
    INSERT INTO messages_discussion (groupe_id, auteur_id, auteur_type, contenu, type_message, is_annonce)
    VALUES (v_groupe_6b_id, NULL, 'SYSTEM', 'Bienvenue dans le groupe de discussion de la classe 6ème B !', 'TEXT', FALSE);

    INSERT INTO messages_discussion (groupe_id, auteur_id, auteur_type, contenu, type_message, is_annonce)
    VALUES (v_groupe_6b_id, v_parent2_id, 'PROFESSEUR',
      '📢 URGENT : Sortie pédagogique au musée prévue le 15 février. Merci de retourner les autorisations signées avant le 10 février.',
      'ANNONCE', TRUE);

    IF v_parent2_id IS NOT NULL THEN
      INSERT INTO messages_discussion (groupe_id, auteur_id, auteur_type, contenu, type_message)
      VALUES (v_groupe_6b_id, v_parent2_id, 'PARENT', 'C''est une sortie obligatoire ?', 'TEXT');
    END IF;

    INSERT INTO messages_discussion (groupe_id, auteur_id, auteur_type, contenu, type_message)
    VALUES (v_groupe_6b_id, v_parent2_id, 'PROFESSEUR', 'Oui, elle fait partie du programme d''histoire-géographie.', 'TEXT');

    IF v_parent5_id IS NOT NULL THEN
      INSERT INTO messages_discussion (groupe_id, auteur_id, auteur_type, contenu, type_message)
      VALUES (v_groupe_6b_id, v_parent5_id, 'PARENT', 'Mon fils a perdu son carnet de correspondance, comment faire ?', 'TEXT');
    END IF;

    INSERT INTO messages_discussion (groupe_id, auteur_id, auteur_type, contenu, type_message)
    VALUES (v_groupe_6b_id, v_parent2_id, 'PROFESSEUR',
      'Il faut passer au secrétariat avec 2000 FCFA pour en obtenir un nouveau. Le carnet est obligatoire.',
      'TEXT');
  END IF;

  -- Messages pour le groupe 3ème B
  IF v_groupe_3b_id IS NOT NULL THEN
    INSERT INTO messages_discussion (groupe_id, auteur_id, auteur_type, contenu, type_message, is_annonce)
    VALUES (v_groupe_3b_id, NULL, 'SYSTEM', 'Bienvenue dans le groupe de discussion de la classe 3ème B !', 'TEXT', FALSE);

    INSERT INTO messages_discussion (groupe_id, auteur_id, auteur_type, contenu, type_message, is_annonce)
    VALUES (v_groupe_3b_id, v_parent3_id, 'PROFESSEUR',
      '🎓 Rappel important : Les inscriptions au BEPC commencent le 1er février. Tous les documents doivent être prêts.',
      'ANNONCE', TRUE);

    IF v_parent3_id IS NOT NULL THEN
      INSERT INTO messages_discussion (groupe_id, auteur_id, auteur_type, contenu, type_message)
      VALUES (v_groupe_3b_id, v_parent3_id, 'PARENT', 'Quels documents sont nécessaires pour l''inscription ?', 'TEXT');
    END IF;

    INSERT INTO messages_discussion (groupe_id, auteur_id, auteur_type, contenu, type_message)
    VALUES (v_groupe_3b_id, v_parent3_id, 'PROFESSEUR',
      'Acte de naissance, certificat de scolarité, photos d''identité et frais d''inscription. La liste complète sera distribuée cette semaine.',
      'TEXT');

    IF v_parent4_id IS NOT NULL THEN
      INSERT INTO messages_discussion (groupe_id, auteur_id, auteur_type, contenu, type_message)
      VALUES (v_groupe_3b_id, v_parent4_id, 'PARENT', 'Y aura-t-il des cours de révision pendant les vacances ?', 'TEXT');
    END IF;

    INSERT INTO messages_discussion (groupe_id, auteur_id, auteur_type, contenu, type_message)
    VALUES (v_groupe_3b_id, v_parent3_id, 'PROFESSEUR',
      'Oui, nous organiserons des sessions de révision en mathématiques et français. Je vous communiquerai le planning bientôt.',
      'TEXT');
  END IF;

  RAISE NOTICE 'Seed data created successfully!';
  RAISE NOTICE 'Classes: 6ème A (%), 6ème B (%), 3ème B (%)', v_classe_6a_id, v_classe_6b_id, v_classe_3b_id;
  RAISE NOTICE 'Groupes: % (6A), % (6B), % (3B)', v_groupe_6a_id, v_groupe_6b_id, v_groupe_3b_id;

EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error creating seed data: %', SQLERRM;
END $$;
