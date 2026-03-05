-- ============================================
-- Housespark MVP – Seed Data
-- Toutes les villas sont situées entre Bordeaux et Toulouse
-- ============================================

-- Reset (supprimer dans l'ordre des dépendances)
delete from public.villa_extras;
delete from public.villa_photos;
delete from public.villas;
delete from public.extras;

-- Extras
insert into public.extras (id, name, description, pricing_type, price_amount) values
  ('e1000000-0000-0000-0000-000000000001', 'Cours de padel', 'Session de 2h avec coach professionnel', 'fixed', 150),
  ('e1000000-0000-0000-0000-000000000002', 'Karting', 'Accès au circuit pendant 1h', 'per_person', 25),
  ('e1000000-0000-0000-0000-000000000003', 'Paintball', 'Partie de paintball tout équipement inclus', 'per_person', 30),
  ('e1000000-0000-0000-0000-000000000004', 'Chef privé (dîner)', 'Menu gastronomique 3 plats avec chef à domicile', 'per_person', 55),
  ('e1000000-0000-0000-0000-000000000005', 'DJ & sono', 'DJ professionnel + matériel sono pour la soirée', 'fixed', 500),
  ('e1000000-0000-0000-0000-000000000006', 'Ménage premium', 'Ménage complet mi-séjour', 'fixed', 200);

-- Villas
insert into public.villas (id, title, slug, location_label, description, capacity_min, capacity_max, price_type, price_amount, activities, equipments, published, available) values
(
  'a1000000-0000-0000-0000-000000000001',
  'Domaine des Pins – Landes',
  'domaine-des-pins-landes',
  'Biscarrosse, Landes',
  'À 45 min des plages de Biscarrosse, le Domaine des Pins est la seule villa des Landes avec piscine intérieure ET extérieure chauffée — baignade garantie toute l''année, qu''il fasse 35°C ou qu''il pleuve ! Pouvant accueillir jusqu''à 45 personnes, idéale pour vos anniversaires, soirées d''entreprise et team buildings. Notre terrain de padel éclairé est dispo 24h/24, pas besoin de réserver à l''heure ! Basket 3×3, beach-volley et pétanque rythment vos journées. La cuisine professionnelle avec chambre froide vous permet d''accueillir chef ou traiteur dans les règles de l''art. Le soir : dancefloor son Bose jusqu''à 110dB, baby-foot, borne d''arcade, billard et poker. Voisins à 500m. Fêtes autorisées.',
  20, 45,
  'per_night', 2800,
  ARRAY['padel', 'basket 3x3', 'piscine', 'beach-volley', 'pétanque'],
  ARRAY['Piscine intérieure chauffée (toute l''année)', 'Piscine extérieure chauffée', 'Terrain de padel éclairé 24h/24', 'Terrain basket 3×3', 'Beach-volley', 'Pétanque & Ping-pong', 'Dancefloor & Sono Bose 110dB', 'Baby-foot & Borne d''arcade', 'Billard & Poker', 'Cuisine professionnelle', 'BBQ couvert', 'Parking 20 places', 'WiFi haut débit'],
  true, true
),
(
  'a1000000-0000-0000-0000-000000000002',
  'Bastide du Gers – Gascogne',
  'bastide-du-gers-gascogne',
  'Condom, Gers',
  'À 1h30 de Bordeaux et Toulouse, au cœur de 8 hectares de vignes gasconnes, la Bastide du Gers est un domaine du XVIIIe entièrement privatisé pour votre groupe. 4 corps de ferme rénovés, jusqu''à 35 personnes — personne ne finira sur le canapé ! On adore la piscine à débordement face aux vignes à perte de vue : l''apéro y prend une autre dimension. La grande salle de réception de 150m² avec sa cuisine professionnelle accueille chef, traiteur ou show culinaire autour du BBQ-cheminée. Le bar en pierre et son dancefloor Bose montent à 110dB — les voisins sont à plus de 500m. Terrain de padel inclus, pétanque provençale, ping-pong. Et pour finir en beauté : dégustation d''Armagnac en cave privée. Propriétaires joignables 24h/24 via WhatsApp.',
  15, 35,
  'per_night', 2200,
  ARRAY['padel', 'piscine', 'pétanque', 'dégustation armagnac', 'randonnée'],
  ARRAY['Piscine à débordement panoramique', 'Terrain de padel', 'Cave à Armagnac (dégustation)', 'Salle de réception 150 pers.', 'Cuisine professionnelle & BBQ-cheminée', 'Bar en pierre & Dancefloor Bose 110dB', 'Terrain de pétanque', 'Ping-pong & Molkky', 'Baby-foot & Billard', 'Parking 15 places', 'WiFi haut débit', 'Cheminée'],
  true, true
),
(
  'a1000000-0000-0000-0000-000000000003',
  'Villa du Lac – Lot-et-Garonne',
  'villa-du-lac-lot-et-garonne',
  'Nérac, Lot-et-Garonne',
  'L''ambiance Club Med à 1h de Bordeaux et Toulouse. La Villa du Lac possède son propre lac de 2 hectares — wakeboard, paddle et kayak inclus dans le séjour, pas de supplément ! Piscine chauffée avec pool-house et bar extérieur pour les apéros au soleil, bain nordique à 38°C face à l''eau pour les soirées. Terrain de padel éclairé 24h/24, basket 3×3, beach-volley, pétanque. Grande salle de réception avec cuisine pro pour 40 couverts. Le soir : dancefloor, sono Octavio + Bose 110dB, billard, baby-foot, borne d''arcade. Voisins à plus de 400m. Propriétaires joignables 24h/24.',
  20, 40,
  'per_night', 2500,
  ARRAY['padel', 'basket 3x3', 'wakeboard', 'paddle', 'bain nordique'],
  ARRAY['Lac privé 2 hectares', 'Wakeboard & Jet-ski', 'Paddle & Kayak', 'Piscine chauffée', 'Pool-house & Bar extérieur', 'Bain nordique 38°C', 'Terrain de padel éclairé 24h/24', 'Terrain basket 3×3', 'Beach-volley & Pétanque', 'Dancefloor & Sono Bose 110dB', 'Baby-foot & Borne d''arcade', 'Billard', 'Cuisine professionnelle', 'Parking 15 places', 'WiFi haut débit'],
  true, true
),
(
  'a1000000-0000-0000-0000-000000000004',
  'Mas de la Garonne – Tarn-et-Garonne',
  'mas-de-la-garonne-tarn',
  'Moissac, Tarn-et-Garonne',
  'À 45 min de Toulouse et Bordeaux, le Mas de la Garonne offre une vue imprenable sur la vallée depuis ses terrasses en pierre dorée. Jusqu''à 30 personnes dans 11 chambres, 6 salles de bain — la guerre des douches n''aura pas lieu ! On adore la grande salle à manger de 120m², la plus conviviale du coin pour vos banquets et dîners de groupe. Juste à côté, le bar lounge avec son canapé XXL et son ambiance so chill. Piscine extérieure chauffée, bain nordique face aux vignes, terrain de padel, basket 3×3 et beach-volley. Dancefloor son Bose 110dB, billard, baby-foot, borne d''arcade et table de poker. Le verger de 1 hectare est à votre disposition. Voisins à 350m.',
  15, 30,
  'per_night', 1900,
  ARRAY['padel', 'basket 3x3', 'bain nordique', 'beach-volley', 'pétanque'],
  ARRAY['Piscine extérieure chauffée', 'Bain nordique 38°C', 'Terrain de padel', 'Terrain basket 3×3', 'Beach-volley & Pétanque', 'Grande salle à manger 120m²', 'Bar lounge & Dancefloor Bose 110dB', 'Billard & Baby-foot', 'Borne d''arcade & Poker', 'Cuisine professionnelle', 'Verger 1 hectare', 'BBQ', 'Parking 10 places', 'WiFi haut débit'],
  true, true
),
(
  'a1000000-0000-0000-0000-000000000005',
  'Domaine de la Forêt – Dordogne',
  'domaine-de-la-foret-dordogne',
  'Bergerac, Dordogne',
  'À 1h de Bordeaux, le Domaine de la Forêt s''étend sur 12 hectares en pleine forêt périgourdine, avec rivière privée pour la pêche et la baignade estivale — aucun voisin à moins de 600m. La grande piscine intérieure chauffée garantit pool party toute l''année, le portail s''ouvre en grand l''été pour une fusion intérieur-extérieur. Piscine extérieure, spa (sauna finlandais + jacuzzi 8 places), salle de sport. Terrain de padel éclairé 24h/24, basket 3×3, beach-volley, pétanque. La salle de réception avec son bar en bois, son dancefloor et sa sono Octavio + Bose monte à 110dB. Billard, baby-foot, console, jeux de société. Technicien envoyé sur place en cas de besoin.',
  20, 45,
  'per_night', 3100,
  ARRAY['padel', 'basket 3x3', 'spa', 'pêche', 'bain nordique'],
  ARRAY['Piscine intérieure chauffée (toute l''année)', 'Piscine extérieure', 'Spa — Sauna finlandais + Jacuzzi 8 places', 'Rivière privée (pêche & baignade)', 'Terrain de padel éclairé 24h/24', 'Terrain basket 3×3', 'Beach-volley & Pétanque', 'Salle de réception & Bar en bois', 'Dancefloor & Sono Bose 110dB', 'Baby-foot & Billard', 'Console & Borne d''arcade', 'Salle de sport', 'Cuisine professionnelle', 'Parking 20 places', 'WiFi haut débit'],
  true, true
),
(
  'a1000000-0000-0000-0000-000000000006',
  'Château des Coteaux – Gironde',
  'chateau-des-coteaux-gironde',
  'Langon, Gironde',
  'À 45 min de Bordeaux, au cœur du vignoble de Sauternes, le Château des Coteaux est notre villa la plus iconique. Façade XIXe, cave à vins privée de 800 bouteilles, terrasse panoramique sur les vignes à perte de vue. Piscine extérieure chauffée avec transats, terrain de padel éclairé, basket 3×3, pétanque dans le parc. La salle voûtée de réception accueille 80 convives pour vos banquets ; la cuisine professionnelle avec chambre froide vous permet de faire venir le chef de votre choix. Bar en pierre taillée, dancefloor son Bose 110dB, billard, baby-foot, borne d''arcade, table de poker. Propriétaires joignables 24h/24 via WhatsApp. Pas de voisins à moins de 500m.',
  20, 45,
  'per_night', 3400,
  ARRAY['padel', 'basket 3x3', 'piscine', 'dégustation vin', 'pétanque'],
  ARRAY['Piscine extérieure chauffée panoramique', 'Terrain de padel éclairé', 'Terrain basket 3×3', 'Pétanque dans le parc', 'Cave à vins privée 800 bouteilles', 'Salle voûtée de réception 80 pers.', 'Cuisine professionnelle & Chambre froide', 'Bar en pierre & Dancefloor Bose 110dB', 'Billard & Baby-foot', 'Borne d''arcade & Poker', 'Terrasse panoramique vignoble', 'BBQ', 'Parking 20 places', 'WiFi haut débit'],
  true, true
);

-- Villa photos
-- Schéma uniforme par villa (8 photos) :
--   0 = façade principale
--   1 = extérieur — piscine / lac
--   2 = extérieur — terrasse / jardin
--   3 = activité — padel
--   4 = activité propre à la villa
--   5 = intérieur — salon / séjour
--   6 = intérieur — chambre
--   7 = intérieur — pièce signature (cuisine, cave, spa, salle voûtée…)
-- Source : images.unsplash.com — IDs vérifiés par fetch live des pages Unsplash
insert into public.villa_photos (villa_id, url, alt, sort_order) values

  -- -------------------------------------------------------
  -- V1 · Domaine des Pins – Landes
  -- villa contemporaine, piscines, padel, basket, cuisine de chef
  -- -------------------------------------------------------
  ('a1000000-0000-0000-0000-000000000001', 'https://gohfzkopbwbnkcchuhta.supabase.co/storage/v1/object/public/villa-photos/villa-1/00.png', 'Domaine des Pins – Vue extérieure de la villa', 0),
  ('a1000000-0000-0000-0000-000000000001', 'https://gohfzkopbwbnkcchuhta.supabase.co/storage/v1/object/public/villa-photos/villa-1/01.png', 'Domaine des Pins – Piscine intérieure chauffée', 1),
  ('a1000000-0000-0000-0000-000000000001', 'https://gohfzkopbwbnkcchuhta.supabase.co/storage/v1/object/public/villa-photos/villa-1/02.png', 'Domaine des Pins – Terrasse et espace extérieur', 2),
  ('a1000000-0000-0000-0000-000000000001', 'https://gohfzkopbwbnkcchuhta.supabase.co/storage/v1/object/public/villa-photos/villa-1/03.png', 'Domaine des Pins – Espaces extérieurs et activités', 3),
  ('a1000000-0000-0000-0000-000000000001', 'https://gohfzkopbwbnkcchuhta.supabase.co/storage/v1/object/public/villa-photos/villa-1/04.png', 'Domaine des Pins – Terrain de sport et padel', 4),
  ('a1000000-0000-0000-0000-000000000001', 'https://gohfzkopbwbnkcchuhta.supabase.co/storage/v1/object/public/villa-photos/villa-1/05.png', 'Domaine des Pins – Grand salon lumineux', 5),
  ('a1000000-0000-0000-0000-000000000001', 'https://gohfzkopbwbnkcchuhta.supabase.co/storage/v1/object/public/villa-photos/villa-1/06.png', 'Domaine des Pins – Chambre avec salle de bain', 6),
  ('a1000000-0000-0000-0000-000000000001', 'https://gohfzkopbwbnkcchuhta.supabase.co/storage/v1/object/public/villa-photos/villa-1/07.png', 'Domaine des Pins – Cuisine professionnelle', 7),

  -- -------------------------------------------------------
  -- V2 · Bastide du Gers – Gascogne
  -- bastide pierre XVIIIe, vignes, piscine débordement, Armagnac
  -- -------------------------------------------------------
  ('a1000000-0000-0000-0000-000000000002', 'https://gohfzkopbwbnkcchuhta.supabase.co/storage/v1/object/public/villa-photos/villa-2/00.png', 'Bastide du Gers – Vue extérieure de la bastide', 0),
  ('a1000000-0000-0000-0000-000000000002', 'https://gohfzkopbwbnkcchuhta.supabase.co/storage/v1/object/public/villa-photos/villa-2/01.png', 'Bastide du Gers – Piscine et espaces extérieurs', 1),
  ('a1000000-0000-0000-0000-000000000002', 'https://gohfzkopbwbnkcchuhta.supabase.co/storage/v1/object/public/villa-photos/villa-2/02.png', 'Bastide du Gers – Salle de réception', 2),
  ('a1000000-0000-0000-0000-000000000002', 'https://gohfzkopbwbnkcchuhta.supabase.co/storage/v1/object/public/villa-photos/villa-2/03.png', 'Bastide du Gers – Terrain de padel extérieur', 3),
  ('a1000000-0000-0000-0000-000000000002', 'https://gohfzkopbwbnkcchuhta.supabase.co/storage/v1/object/public/villa-photos/villa-2/04.png', 'Bastide du Gers – Espaces extérieurs et activités', 4),
  ('a1000000-0000-0000-0000-000000000002', 'https://gohfzkopbwbnkcchuhta.supabase.co/storage/v1/object/public/villa-photos/villa-2/05.png', 'Bastide du Gers – Salon avec cheminée en pierres apparentes', 5),
  ('a1000000-0000-0000-0000-000000000002', 'https://gohfzkopbwbnkcchuhta.supabase.co/storage/v1/object/public/villa-photos/villa-2/06.png', 'Bastide du Gers – Chambre sous les poutres', 6),
  ('a1000000-0000-0000-0000-000000000002', 'https://gohfzkopbwbnkcchuhta.supabase.co/storage/v1/object/public/villa-photos/villa-2/07.png', 'Bastide du Gers – Cave à Armagnac et salle de réception', 7),

  -- -------------------------------------------------------
  -- V3 · Villa du Lac – Lot-et-Garonne
  -- villa moderne, lac privé, pool-house, bar, wakeboard
  -- -------------------------------------------------------
  ('a1000000-0000-0000-0000-000000000003', 'https://gohfzkopbwbnkcchuhta.supabase.co/storage/v1/object/public/villa-photos/villa-3/00.png', 'Villa du Lac – Façade et extérieur de la villa', 0),
  ('a1000000-0000-0000-0000-000000000003', 'https://gohfzkopbwbnkcchuhta.supabase.co/storage/v1/object/public/villa-photos/villa-3/01.png', 'Villa du Lac – Piscine chauffée et bain nordique', 1),
  ('a1000000-0000-0000-0000-000000000003', 'https://gohfzkopbwbnkcchuhta.supabase.co/storage/v1/object/public/villa-photos/villa-3/02.png', 'Villa du Lac – Terrasse et espaces de vie extérieurs', 2),
  ('a1000000-0000-0000-0000-000000000003', 'https://gohfzkopbwbnkcchuhta.supabase.co/storage/v1/object/public/villa-photos/villa-3/03.png', 'Villa du Lac – Terrain de padel éclairé', 3),
  ('a1000000-0000-0000-0000-000000000003', 'https://gohfzkopbwbnkcchuhta.supabase.co/storage/v1/object/public/villa-photos/villa-3/04.png', 'Villa du Lac – Détente en bord de piscine et lac', 4),
  ('a1000000-0000-0000-0000-000000000003', 'https://gohfzkopbwbnkcchuhta.supabase.co/storage/v1/object/public/villa-photos/villa-3/05.png', 'Villa du Lac – Séjour lumineux vue lac', 5),
  ('a1000000-0000-0000-0000-000000000003', 'https://gohfzkopbwbnkcchuhta.supabase.co/storage/v1/object/public/villa-photos/villa-3/06.png', 'Villa du Lac – Chambre avec vue', 6),
  ('a1000000-0000-0000-0000-000000000003', 'https://gohfzkopbwbnkcchuhta.supabase.co/storage/v1/object/public/villa-photos/villa-3/07.png', 'Villa du Lac – Bar et pool-house', 7),

  -- -------------------------------------------------------
  -- V4 · Mas de la Garonne – Tarn-et-Garonne
  -- mas ocre, terrasse vallée, pétanque, verger, cuisine de chef
  -- -------------------------------------------------------
  ('a1000000-0000-0000-0000-000000000004', 'https://gohfzkopbwbnkcchuhta.supabase.co/storage/v1/object/public/villa-photos/villa-4/04.png', 'Mas de la Garonne – Terrain pétanque et verger', 0),
  ('a1000000-0000-0000-0000-000000000004', 'https://gohfzkopbwbnkcchuhta.supabase.co/storage/v1/object/public/villa-photos/villa-4/01.png', 'Mas de la Garonne – Piscine et grande terrasse', 1),
  ('a1000000-0000-0000-0000-000000000004', 'https://gohfzkopbwbnkcchuhta.supabase.co/storage/v1/object/public/villa-photos/villa-4/02.png', 'Mas de la Garonne – Bain nordique et espace détente', 2),
  ('a1000000-0000-0000-0000-000000000004', 'https://gohfzkopbwbnkcchuhta.supabase.co/storage/v1/object/public/villa-photos/villa-4/03.png', 'Mas de la Garonne – Terrain de padel', 3),
  ('a1000000-0000-0000-0000-000000000004', 'https://gohfzkopbwbnkcchuhta.supabase.co/storage/v1/object/public/villa-photos/villa-4/00.png', 'Mas de la Garonne – Façade et extérieur du mas', 4),
  ('a1000000-0000-0000-0000-000000000004', 'https://gohfzkopbwbnkcchuhta.supabase.co/storage/v1/object/public/villa-photos/villa-4/05.png', 'Mas de la Garonne – Grand salon avec escalier en pierre', 5),
  ('a1000000-0000-0000-0000-000000000004', 'https://gohfzkopbwbnkcchuhta.supabase.co/storage/v1/object/public/villa-photos/villa-4/06.png', 'Mas de la Garonne – Chambre avec salle de bain', 6),
  ('a1000000-0000-0000-0000-000000000004', 'https://gohfzkopbwbnkcchuhta.supabase.co/storage/v1/object/public/villa-photos/villa-4/07.png', 'Mas de la Garonne – Cuisine de chef avec table conviviale', 7),

  -- -------------------------------------------------------
  -- V5 · Domaine de la Forêt – Dordogne
  -- maison de maître, forêt, piscine int., spa, sauna, rivière
  -- -------------------------------------------------------
  ('a1000000-0000-0000-0000-000000000005', 'https://gohfzkopbwbnkcchuhta.supabase.co/storage/v1/object/public/villa-photos/villa-5/00.png', 'Domaine de la Forêt – Vue extérieure du domaine', 0),
  ('a1000000-0000-0000-0000-000000000005', 'https://gohfzkopbwbnkcchuhta.supabase.co/storage/v1/object/public/villa-photos/villa-5/01.png', 'Domaine de la Forêt – Piscine intérieure chauffée', 1),
  ('a1000000-0000-0000-0000-000000000005', 'https://gohfzkopbwbnkcchuhta.supabase.co/storage/v1/object/public/villa-photos/villa-5/02.png', 'Domaine de la Forêt – Espaces sportifs et terrasse', 2),
  ('a1000000-0000-0000-0000-000000000005', 'https://gohfzkopbwbnkcchuhta.supabase.co/storage/v1/object/public/villa-photos/villa-5/03.png', 'Domaine de la Forêt – Terrain de padel éclairé', 3),
  ('a1000000-0000-0000-0000-000000000005', 'https://gohfzkopbwbnkcchuhta.supabase.co/storage/v1/object/public/villa-photos/villa-5/04.png', 'Domaine de la Forêt – Sauna et espace spa', 4),
  ('a1000000-0000-0000-0000-000000000005', 'https://gohfzkopbwbnkcchuhta.supabase.co/storage/v1/object/public/villa-photos/villa-5/05.png', 'Domaine de la Forêt – Grand salon bibliothèque', 5),
  ('a1000000-0000-0000-0000-000000000005', 'https://gohfzkopbwbnkcchuhta.supabase.co/storage/v1/object/public/villa-photos/villa-5/06.png', 'Domaine de la Forêt – Suite master avec baignoire', 6),
  ('a1000000-0000-0000-0000-000000000005', 'https://gohfzkopbwbnkcchuhta.supabase.co/storage/v1/object/public/villa-photos/villa-5/07.png', 'Domaine de la Forêt – Espace spa et hammam', 7),

  -- -------------------------------------------------------
  -- V6 · Château des Coteaux – Gironde
  -- château XIX, vignoble Sauternais, cave à vins, salle voûtée
  -- -------------------------------------------------------
  ('a1000000-0000-0000-0000-000000000006', 'https://gohfzkopbwbnkcchuhta.supabase.co/storage/v1/object/public/villa-photos/villa-6/00.png', 'Château des Coteaux – Façade et vue extérieure', 0),
  ('a1000000-0000-0000-0000-000000000006', 'https://gohfzkopbwbnkcchuhta.supabase.co/storage/v1/object/public/villa-photos/villa-6/01.png', 'Château des Coteaux – Piscine et espaces extérieurs', 1),
  ('a1000000-0000-0000-0000-000000000006', 'https://gohfzkopbwbnkcchuhta.supabase.co/storage/v1/object/public/villa-photos/villa-6/02.png', 'Château des Coteaux – Espaces sportifs et parc', 2),
  ('a1000000-0000-0000-0000-000000000006', 'https://gohfzkopbwbnkcchuhta.supabase.co/storage/v1/object/public/villa-photos/villa-6/03.png', 'Château des Coteaux – Terrain de padel', 3),
  ('a1000000-0000-0000-0000-000000000006', 'https://gohfzkopbwbnkcchuhta.supabase.co/storage/v1/object/public/villa-photos/villa-6/04.png', 'Château des Coteaux – Dégustation de vins du domaine', 4),
  ('a1000000-0000-0000-0000-000000000006', 'https://gohfzkopbwbnkcchuhta.supabase.co/storage/v1/object/public/villa-photos/villa-6/05.png', 'Château des Coteaux – Salle de réception voûtée', 5),
  ('a1000000-0000-0000-0000-000000000006', 'https://gohfzkopbwbnkcchuhta.supabase.co/storage/v1/object/public/villa-photos/villa-6/06.png', 'Château des Coteaux – Chambre de standing vue vignoble', 6),
  ('a1000000-0000-0000-0000-000000000006', 'https://gohfzkopbwbnkcchuhta.supabase.co/storage/v1/object/public/villa-photos/villa-6/07.png', 'Château des Coteaux – Cave à vins privée 800 bouteilles', 7);

-- Villa ↔ Extras relations
insert into public.villa_extras (villa_id, extra_id) values
  ('a1000000-0000-0000-0000-000000000001', 'e1000000-0000-0000-0000-000000000001'),
  ('a1000000-0000-0000-0000-000000000001', 'e1000000-0000-0000-0000-000000000004'),
  ('a1000000-0000-0000-0000-000000000001', 'e1000000-0000-0000-0000-000000000005'),
  ('a1000000-0000-0000-0000-000000000001', 'e1000000-0000-0000-0000-000000000006'),
  ('a1000000-0000-0000-0000-000000000002', 'e1000000-0000-0000-0000-000000000001'),
  ('a1000000-0000-0000-0000-000000000002', 'e1000000-0000-0000-0000-000000000004'),
  ('a1000000-0000-0000-0000-000000000002', 'e1000000-0000-0000-0000-000000000006'),
  ('a1000000-0000-0000-0000-000000000003', 'e1000000-0000-0000-0000-000000000001'),
  ('a1000000-0000-0000-0000-000000000003', 'e1000000-0000-0000-0000-000000000002'),
  ('a1000000-0000-0000-0000-000000000003', 'e1000000-0000-0000-0000-000000000005'),
  ('a1000000-0000-0000-0000-000000000004', 'e1000000-0000-0000-0000-000000000001'),
  ('a1000000-0000-0000-0000-000000000004', 'e1000000-0000-0000-0000-000000000003'),
  ('a1000000-0000-0000-0000-000000000004', 'e1000000-0000-0000-0000-000000000005'),
  ('a1000000-0000-0000-0000-000000000005', 'e1000000-0000-0000-0000-000000000001'),
  ('a1000000-0000-0000-0000-000000000005', 'e1000000-0000-0000-0000-000000000004'),
  ('a1000000-0000-0000-0000-000000000005', 'e1000000-0000-0000-0000-000000000005'),
  ('a1000000-0000-0000-0000-000000000005', 'e1000000-0000-0000-0000-000000000006'),
  ('a1000000-0000-0000-0000-000000000006', 'e1000000-0000-0000-0000-000000000001'),
  ('a1000000-0000-0000-0000-000000000006', 'e1000000-0000-0000-0000-000000000004'),
  ('a1000000-0000-0000-0000-000000000006', 'e1000000-0000-0000-0000-000000000005');
