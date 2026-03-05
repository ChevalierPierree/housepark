# Housespark – MVP

Webapp de réservation de villas de groupe (jusqu'à 45 personnes).

## Stack technique

- **Framework** : Next.js 15 (App Router) + TypeScript
- **Style** : Tailwind CSS v4
- **Auth / DB / Storage** : Supabase
- **Emails** : Resend
- **Icônes** : Lucide React
- **Déploiement** : Vercel

## Pré-requis

- Node.js 20+
- Compte Supabase (gratuit)
- Compte Resend (gratuit, optionnel pour emails)

## Installation

```bash
cd housespark-app
npm install
```

## Configuration

1. **Créer un projet Supabase** sur [supabase.com](https://supwabase.com)

2. **Copier le fichier d'environnement** :
```bash
cp .env.example .env.local
```

3. **Remplir les variables** dans `.env.local` :
```
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-anon-key
SUPABASE_SERVICE_ROLE_KEY=votre-service-role-key
RESEND_API_KEY=re_votre_clé  # optionnel
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Initialiser la base de données** :
   - Aller dans le SQL Editor de Supabase
   - Exécuter `supabase/schema.sql` (crée les tables et les policies RLS)
   - Exécuter `supabase/seed.sql` (insère 6 villas d'exemple + extras)

5. **Créer un utilisateur admin** :
   - S'inscrire normalement sur l'app
   - Dans Supabase > Table Editor > `profiles`, changer le `role` de votre user en `admin`

## Lancement

```bash
npm run dev
```

L'app sera accessible sur [http://localhost:3000](http://localhost:3000)

## Structure du projet

```
src/
├── app/
│   ├── page.tsx                 # Accueil
│   ├── concept/page.tsx         # Le concept
│   ├── activites/page.tsx       # Activités
│   ├── villas/
│   │   ├── page.tsx             # Catalogue + filtres
│   │   └── [slug]/page.tsx      # Détail villa
│   ├── booking/
│   │   ├── recap/page.tsx       # Récapitulatif réservation
│   │   └── merci/page.tsx       # Confirmation
│   ├── login/page.tsx           # Connexion
│   ├── register/page.tsx        # Inscription
│   ├── account/page.tsx         # Mon compte
│   ├── admin/
│   │   ├── page.tsx             # Dashboard admin
│   │   ├── villas/              # CRUD villas
│   │   ├── extras/              # CRUD extras
│   │   └── bookings/            # Liste réservations
│   └── api/
│       └── bookings/route.ts    # API création réservation
├── components/
│   ├── layout/                  # Header, Footer
│   ├── ui/                      # Button, Input
│   ├── villas/                  # VillaCard, PhotoCarousel, etc.
│   ├── booking/                 # BookingForm
│   ├── auth/                    # LogoutButton
│   └── admin/                   # VillaForm, ExtrasClient
├── lib/
│   ├── supabase/                # Client, Server, Middleware
│   ├── types.ts                 # Types TypeScript
│   └── utils.ts                 # Utilitaires
└── middleware.ts                # Auth middleware
```

## Base de données

Le schéma est dans `supabase/schema.sql`. Tables :

- **profiles** : Utilisateurs (extends auth.users)
- **villas** : Propriétés
- **villa_photos** : Photos des villas
- **extras** : Services additionnels
- **villa_extras** : Relation villas ↔ extras
- **bookings** : Réservations
- **booking_extras** : Extras d'une réservation

## Seed data

6 villas d'exemple :
- Villa Sunrise – Côte d'Azur
- Mas des Oliviers – Provence
- Chalet Grand Massif – Alpes
- Domaine de la Plage – Landes
- Bastide Royale – Périgord
- Villa Porto-Vecchio – Corse

6 extras :
- Cours de padel, Karting, Paintball, Chef privé, DJ & sono, Ménage premium

## Déploiement (Vercel)

1. Push sur GitHub
2. Importer le repo sur [vercel.com](https://vercel.com)
3. Ajouter les variables d'environnement
4. Déployer

## Checklist de déploiement

- [ ] Variables d'environnement configurées
- [ ] Schema SQL exécuté dans Supabase
- [ ] Seed data inséré
- [ ] Storage bucket créé (pour upload photos)
- [ ] Utilisateur admin créé
- [ ] Domaine Resend vérifié (pour emails prod)
- [ ] Config CORS Supabase mise à jour avec le domaine de prod
