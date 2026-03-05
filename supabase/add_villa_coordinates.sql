-- Migration: Ajout des colonnes latitude / longitude aux villas
-- À exécuter dans Supabase Dashboard > SQL Editor

ALTER TABLE villas
  ADD COLUMN IF NOT EXISTS latitude  DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;

-- Coordonnées réelles des villas
UPDATE villas SET latitude = 43.5528, longitude =  7.0174 WHERE slug = 'villa-sunrise-cote-azur';      -- Cannes
UPDATE villas SET latitude = 43.5297, longitude =  5.4474 WHERE slug = 'mas-oliviers-provence';        -- Aix-en-Provence
UPDATE villas SET latitude = 45.8566, longitude =  6.6183 WHERE slug = 'chalet-grand-massif-alpes';    -- Megève
UPDATE villas SET latitude = 43.6645, longitude = -1.4065 WHERE slug = 'domaine-plage-landes';         -- Hossegor
UPDATE villas SET latitude = 44.8892, longitude =  1.2167 WHERE slug = 'bastide-royale-perigord';      -- Sarlat
UPDATE villas SET latitude = 41.5917, longitude =  9.2794 WHERE slug = 'villa-porto-vecchio-corse';    -- Porto-Vecchio
