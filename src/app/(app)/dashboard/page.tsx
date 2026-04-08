import Link from 'next/link';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { OrnamentDivider, TattooMachine, RoseOutline } from '@/components/icons';

export default async function DashboardPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      artist: {
        include: {
          _count: {
            select: { portfolio: true, bookings: true },
          },
        },
      },
    },
  });

  if (!user) redirect('/login');

  const isArtist = user.role === 'ARTIST' && user.artist;

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-foreground">
          Bienvenue{user.name ? `, ${user.name}` : ''} 👋
        </h1>
        <p className="mt-1 text-muted">
          {isArtist ? 'Gérez votre profil et votre portfolio.' : 'Votre espace InkBoard.'}
        </p>
      </div>

      {isArtist ? (
        <ArtistDashboard
          artist={user.artist!}
          artworkCount={user.artist!._count.portfolio}
          bookingCount={user.artist!._count.bookings}
        />
      ) : (
        <VisitorDashboard />
      )}
    </div>
  );
}

function ArtistDashboard({
  artist,
  artworkCount,
  bookingCount,
}: {
  artist: { verified: boolean; shopName: string | null; city: string | null };
  artworkCount: number;
  bookingCount: number;
}) {
  return (
    <div className="space-y-6">
      {/* Status */}
      {!artist.verified && (
        <div className="rounded-xl border border-accent/30 bg-accent/5 p-4">
          <p className="text-sm text-accent">
            ⏳ Votre SIRET est en cours de vérification. Votre profil sera visible une fois validé.
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard icon={<RoseOutline className="h-8 w-8" />} label="Oeuvres" value={artworkCount} />
        <StatCard
          icon={<TattooMachine className="h-8 w-8" />}
          label="Rendez-vous"
          value={bookingCount}
        />
        <StatCard icon={null} label="Statut" value={artist.verified ? 'Vérifié' : 'En attente'} />
      </div>

      <OrnamentDivider className="mx-auto w-48 text-accent/15" />

      {/* Quick actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Link
          href="/profile"
          className="rounded-xl border border-card-border bg-card p-6 transition-colors hover:border-accent/30"
        >
          <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-foreground">
            Mon profil
          </h3>
          <p className="mt-1 text-sm text-muted">
            {artist.shopName ?? 'Configurer'} &mdash; {artist.city ?? 'Ajouter une ville'}
          </p>
        </Link>
        <Link
          href="/profile#portfolio"
          className="rounded-xl border border-card-border bg-card p-6 transition-colors hover:border-accent/30"
        >
          <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-foreground">
            Portfolio
          </h3>
          <p className="mt-1 text-sm text-muted">
            {artworkCount} oeuvre{artworkCount !== 1 ? 's' : ''} &mdash; Ajouter des photos
          </p>
        </Link>
      </div>
    </div>
  );
}

function VisitorDashboard() {
  return (
    <div className="flex flex-col items-center py-12 text-center">
      <TattooMachine className="mb-6 h-16 w-16 text-accent/40" />
      <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground">
        Vous êtes tatoueur professionnel ?
      </h2>
      <p className="mx-auto mt-2 max-w-md text-muted">
        Créez votre profil artiste, ajoutez votre portfolio et commencez à recevoir des demandes de
        rendez-vous.
      </p>
      <Link
        href="/become-artist"
        className="mt-8 rounded-xl bg-accent px-8 py-3.5 font-semibold text-background transition-colors hover:bg-accent-hover"
      >
        Devenir artiste
      </Link>

      <OrnamentDivider className="mt-12 w-48 text-accent/15" />

      <p className="mt-8 text-sm text-muted">
        Sinon, explorez les profils d&apos;artistes et trouvez votre prochain tatoueur.
      </p>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-xl border border-card-border bg-card p-5">
      <div className="mb-2 text-accent">{icon}</div>
      <div className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground">
        {value}
      </div>
      <div className="text-sm text-muted">{label}</div>
    </div>
  );
}
