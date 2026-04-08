import Link from 'next/link';
import {
  TattooMachine,
  RoseOutline,
  SnakeIllustration,
  DaggerIllustration,
  OrnamentDivider,
} from '@/components/icons';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Decorative background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-48 top-1/4 h-[500px] w-[500px] rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute -right-48 bottom-1/4 h-[500px] w-[500px] rounded-full bg-accent/5 blur-3xl" />
        {/* Floating illustrations */}
        <RoseOutline className="absolute left-[8%] top-[15%] h-32 w-32 text-accent/[0.07] rotate-[-15deg]" />
        <SnakeIllustration className="absolute right-[5%] top-[10%] h-48 w-48 text-accent/[0.05] rotate-[10deg]" />
        <DaggerIllustration className="absolute left-[12%] bottom-[10%] h-40 w-40 text-accent/[0.06] rotate-[20deg]" />
        <RoseOutline className="absolute right-[10%] bottom-[20%] h-24 w-24 text-accent/[0.05] rotate-[30deg]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 md:px-12">
        <div className="flex items-center gap-2">
          <TattooMachine className="h-7 w-7 text-accent" />
          <span className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight">
            Ink<span className="text-accent">Board</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-background transition-colors hover:bg-accent-hover"
          >
            Connexion
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="max-w-3xl">
          <OrnamentDivider className="mx-auto mb-6 w-48 text-accent/30" />

          <p className="mb-4 text-sm font-medium uppercase tracking-[0.25em] text-accent">
            Plateforme pour tatoueurs professionnels
          </p>

          <h1 className="font-[family-name:var(--font-display)] text-5xl font-bold leading-[1.1] tracking-tight text-foreground md:text-7xl">
            Votre art
            <br />
            mérite <span className="italic text-accent">sa vitrine</span>
          </h1>

          <OrnamentDivider className="mx-auto my-8 w-64 text-accent/20" />

          <p className="mx-auto max-w-lg text-lg leading-relaxed text-muted">
            Créez votre portfolio, gérez vos rendez-vous et connectez-vous avec vos futurs clients.
            Vérifié par SIRET, réservé aux professionnels.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/login"
              className="group relative overflow-hidden rounded-xl bg-accent px-8 py-3.5 text-base font-semibold text-background transition-all hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/20"
            >
              Rejoindre InkBoard
            </Link>
            <Link
              href="/explore"
              className="rounded-xl border border-card-border px-8 py-3.5 text-base font-medium text-foreground transition-colors hover:border-accent/40 hover:text-accent"
            >
              Explorer les artistes
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-24 grid grid-cols-3 gap-16 border-t border-card-border pt-10">
          <div>
            <div className="font-[family-name:var(--font-display)] text-4xl font-bold text-accent">
              100%
            </div>
            <div className="mt-1 text-sm text-muted">Vérifié SIRET</div>
          </div>
          <div>
            <div className="font-[family-name:var(--font-display)] text-4xl font-bold text-accent">
              0&euro;
            </div>
            <div className="mt-1 text-sm text-muted">Pour commencer</div>
          </div>
          <div>
            <div className="font-[family-name:var(--font-display)] text-4xl font-bold text-accent">
              24/7
            </div>
            <div className="mt-1 text-sm text-muted">Prise de RDV</div>
          </div>
        </div>
      </main>

      {/* Features */}
      <section id="features" className="relative z-10 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-4xl">
          <OrnamentDivider className="mx-auto mb-8 w-56 text-accent/20" />
          <h2 className="mb-4 text-center font-[family-name:var(--font-display)] text-4xl font-bold text-foreground">
            Tout ce qu&apos;il faut pour <span className="italic text-accent">briller</span>
          </h2>
          <p className="mx-auto mb-12 max-w-md text-center text-muted">
            Des outils pensés pour les artistes, pas les développeurs.
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            <FeatureCard
              icon={<RoseOutline className="h-10 w-10" />}
              title="Portfolio"
              description="Galerie photo avec filtres par style. Montrez votre travail sous son meilleur jour."
            />
            <FeatureCard
              icon={<TattooMachine className="h-10 w-10" />}
              title="Rendez-vous"
              description="Calendrier intégré, créneaux personnalisables. Vos clients réservent en ligne."
            />
            <FeatureCard
              icon={<DaggerIllustration className="h-10 w-10" />}
              title="Vérifié"
              description="Vérification SIRET automatique. Seuls les pros ont accès à la plateforme."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 py-20 text-center md:px-12">
        <div className="mx-auto max-w-2xl rounded-2xl border border-card-border bg-card p-12">
          <DaggerIllustration className="mx-auto mb-6 h-16 w-16 text-accent/40" />
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold text-foreground">
            Prêt à montrer votre <span className="italic text-accent">art</span> ?
          </h2>
          <p className="mx-auto mt-3 max-w-sm text-muted">
            Inscription gratuite. Vérification en quelques minutes.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-block rounded-xl bg-accent px-10 py-4 text-base font-semibold text-background transition-all hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/20"
          >
            Créer mon profil artiste
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-card-border px-6 py-8">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-2">
            <TattooMachine className="h-5 w-5 text-accent/60" />
            <span className="font-[family-name:var(--font-display)] text-sm font-semibold text-muted">
              InkBoard
            </span>
          </div>
          <p className="text-xs text-muted/50">
            {new Date().getFullYear()} &mdash; Tous droits réservés
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-2xl border border-card-border bg-card p-6 transition-all hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5">
      <div className="mb-4 text-accent transition-transform group-hover:scale-110">{icon}</div>
      <h3 className="mb-2 font-[family-name:var(--font-display)] text-xl font-semibold text-foreground">
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-muted">{description}</p>
    </div>
  );
}
