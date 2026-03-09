-- ================================================
-- Script de création de la table pour Gardien YouTube
-- À copier-coller dans l'éditeur SQL de Supabase
-- ================================================

-- Création de la table qui stocke l'historique des visites YouTube validées
CREATE TABLE visites_youtube (
  id         SERIAL PRIMARY KEY,          -- Numéro unique, créé automatiquement
  date_heure TIMESTAMP DEFAULT NOW(),     -- Date et heure de la visite (remplie automatiquement)
  intention  TEXT NOT NULL                -- La phrase saisie par l'utilisateur
);

-- Autoriser l'extension à insérer des données sans authentification
-- (nécessaire car l'extension tourne dans le navigateur, pas sur un serveur)
ALTER TABLE visites_youtube ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Autoriser les insertions publiques"
  ON visites_youtube
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Autoriser la lecture publique"
  ON visites_youtube
  FOR SELECT
  USING (true);
