# Club 5 Octobre — React + Supabase App

Application web moderne pour **Club 5 Octobre (Espace 5 Octobre)** à Mohammedia :

- Frontend : Vite + React 19 + TypeScript + Tailwind CSS + composants style shadcn/ui
- UI/UX : design responsive, mobile-first, ambiance chaleureuse et palette FM6E
- Backend : Supabase (Auth, PostgreSQL, Storage)

## Fonctionnalités incluses

- Navigation complète : Accueil, Menu, Espace Rencontres, À propos, Durabilité, Galerie, Réservation, Contact
- Menu dynamique (filtres/recherche) avec prix réalistes en MAD
- Réservation Espace Rencontres (8 à 20 personnes) avec vérification de disponibilité
- Galerie dynamique avec lightbox
- Dashboard admin protégé : CRUD Menu, upload/suppression Galerie, gestion Réservations
- Support langue principale Français + option Arabe (section réservation)

## Commandes de setup complet

```bash
npm create vite@latest . -- --template react-ts --force
npm install
npm install react-router-dom react-hook-form @hookform/resolvers zod @supabase/supabase-js clsx tailwind-merge class-variance-authority lucide-react date-fns react-day-picker sonner @radix-ui/react-slot @radix-ui/react-dialog @radix-ui/react-tabs @radix-ui/react-label
npm install -D tailwindcss postcss autoprefixer tailwindcss-animate
```

## Variables d’environnement

Copiez `.env.example` vers `.env` puis renseignez :

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_DB_URL=postgresql://postgres:[YOUR-PASSWORD]@db.your-project-ref.supabase.co:5432/postgres
```

> ⚠️ `VITE_*` est public (exposé au navigateur). N'utilisez jamais la clé `service_role` en frontend.

## Schéma Supabase

Le SQL complet est dans `supabase/schema.sql`.

Tables principales :

- `menu_items` (menu dynamique)
- `reservations` (réservations espace rencontres)
- `gallery_images` (métadonnées photos)
- `profiles` (flag `is_admin`)

Storage bucket :

- `club-gallery` (images de la galerie)

Le script inclut :

- contraintes de données
- politiques RLS (public read menu/gallery, public insert reservations, admin full access)
- données seed (Thé à la Menthe 25 MAD, Espresso 30 MAD, Shakshuka 65 MAD, Harira 45 MAD, Chebakia 35 MAD)

## Démarrage local

```bash
npm run dev
```

Build production :

```bash
npm run build
npm run preview
```

## Déploiement Vercel + Supabase

1. Créer un projet Supabase et exécuter `supabase/schema.sql`.
2. Créer un utilisateur admin dans Supabase Auth.
3. Dans `profiles`, mettre `is_admin = true` pour cet utilisateur.
4. Importer le repo sur Vercel.
5. Ajouter `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` dans les variables d’environnement Vercel.
6. Déployer (build command: `npm run build`, output dir: `dist`).

## Mise en production (réel) — checklist rapide

1. **Base de données prête**
   - Exécuter `supabase/schema.sql` dans SQL Editor.
   - Vérifier que les policies RLS sont présentes.
2. **Compte admin prêt**
   - Créer l'utilisateur dans Auth.
   - Exécuter SQL :
     ```sql
     insert into public.profiles (id, full_name, is_admin)
     values ('<AUTH_USER_ID>', 'Admin Club 5 Octobre', true)
     on conflict (id) do update set is_admin = excluded.is_admin;
     ```
3. **Storage prêt**
   - Vérifier le bucket `club-gallery`.
   - Tester upload + suppression depuis le dashboard admin.
4. **Variables d'environnement**
   - Production: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` obligatoires.
   - Le mode fallback démo n'est autorisé qu'en développement local.
5. **Vérifications avant lancement**
   - `npm run lint`
   - `npm run build`
   - Parcours manuel: menu, réservation, galerie, admin.
6. **DNS / SSL / Domaine**
   - Connecter le domaine final dans Vercel.
   - Vérifier HTTPS actif et redirection vers domaine canonique.
7. **Post-go-live**
   - Activer les alertes Supabase (erreurs DB / auth).
   - Faire un backup/export régulier de la base.

## Structure de fichiers clés

- `src/routes/AppRouter.tsx` : routes applicatives
- `src/pages/*` : pages publiques + dashboard admin
- `src/lib/api.ts` : accès Supabase + fallback données locales
- `src/lib/supabase.ts` : client Supabase
- `tailwind.config.ts` : thème FM6E (green branding)
- `supabase/schema.sql` : schéma DB + RLS + storage + seed

## Adresse officielle affichée

**4 Rue Brahim Roudani, Mohammedia, Maroc**
