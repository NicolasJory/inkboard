# InkBoard

Plateforme vitrine pour tatoueurs professionnels.
Portfolio, vérification SIRET, prise de rendez-vous.

## Stack

- **Next.js 15** — App Router, Server Components
- **TypeScript** — strict mode
- **Prisma** + **PostgreSQL** — ORM & base de données
- **Tailwind CSS** — styling utility-first
- **NextAuth.js** — authentification
- **Docker** — environnement de dev local

## Getting Started

### Prérequis

- Node.js 18+
- Docker & Docker Compose

### Installation

```bash
# Cloner le repo
git clone git@github.com-perso:NicolasJory/inkboard.git
cd inkboard

# Installer les dépendances
npm install

# Copier les variables d'environnement
cp .env.example .env

# Lancer la base de données
docker compose up -d

# Appliquer les migrations
npm run db:migrate

# Lancer le serveur de dev
npm run dev
```

L'app est disponible sur [http://localhost:3000](http://localhost:3000).

### Scripts disponibles

| Commande               | Description                     |
| ---------------------- | ------------------------------- |
| `npm run dev`          | Serveur de développement        |
| `npm run build`        | Build de production             |
| `npm run lint`         | Linting ESLint                  |
| `npm run format`       | Formater le code (Prettier)     |
| `npm run format:check` | Vérifier le formatage           |
| `npm run db:migrate`   | Appliquer les migrations Prisma |
| `npm run db:studio`    | Ouvrir Prisma Studio            |

## Architecture

```
src/
├── app/           # Pages (App Router)
├── components/    # Composants UI
├── lib/           # Utilitaires, config auth, clients API
├── server/        # Server actions, logique métier
└── types/         # Types TypeScript
prisma/
└── schema.prisma  # Schéma de la base de données
```

## Fonctionnalités

- [ ] Authentification (email + OAuth)
- [ ] Inscription artiste avec vérification SIRET (API Sirene)
- [ ] Profil public artiste (bio, styles, localisation)
- [ ] Portfolio (galerie d'images avec tags)
- [ ] Recherche par style / ville / disponibilité
- [ ] Prise de rendez-vous
- [ ] Notifications email

## License

MIT
