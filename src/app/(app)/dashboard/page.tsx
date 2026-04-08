import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { TattooMachine, OrnamentDivider } from '@/components/icons';
import { PostCard } from '@/components/post-card';

export default async function DashboardPage() {
  const session = await getSession();
  if (!session?.user) redirect('/login');

  const isArtist = session.user.role === 'ARTIST';

  // Get artist data if applicable
  const artist = isArtist
    ? await prisma.artist.findUnique({
        where: { userId: session.user.id },
        include: {
          _count: { select: { portfolio: true, bookings: true } },
          bookings: {
            where: { status: 'PENDING' },
            include: { user: { select: { name: true, email: true } } },
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
        },
      })
    : null;

  // Recent artworks for the discovery feed
  const artworks = await prisma.artwork.findMany({
    where: { artist: { verified: true } },
    include: {
      artist: {
        include: { user: { select: { name: true, image: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  return (
    <div className="mx-auto max-w-5xl">
      {/* Artist overview */}
      {isArtist && artist && (
        <div className="mb-8">
          {/* Pending bookings */}
          {artist.bookings.length > 0 && (
            <div className="mb-6 rounded-2xl border border-accent/20 bg-accent/5 p-5">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-accent">
                  {artist.bookings.length} demande{artist.bookings.length > 1 ? 's' : ''} en attente
                </h2>
                <Link
                  href="/bookings"
                  className="text-sm font-medium text-accent hover:text-accent-hover"
                >
                  Tout voir &rarr;
                </Link>
              </div>
              <div className="space-y-2">
                {artist.bookings.slice(0, 3).map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between rounded-lg border border-card-border bg-card px-4 py-2.5"
                  >
                    <div>
                      <span className="text-sm font-medium text-foreground">
                        {booking.user.name ?? booking.user.email}
                      </span>
                      <span className="ml-2 text-xs text-muted">
                        {booking.date.toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                    </div>
                    <Link
                      href="/bookings"
                      className="text-xs font-medium text-accent hover:text-accent-hover"
                    >
                      Répondre
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick stats */}
          <div className="flex items-center gap-6 border-b border-card-border pb-6">
            <div>
              <span className="text-2xl font-bold text-foreground">{artist._count.portfolio}</span>
              <span className="ml-1 text-sm text-muted">posts</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-foreground">{artist._count.bookings}</span>
              <span className="ml-1 text-sm text-muted">RDV</span>
            </div>
            <div className="flex-1" />
            <Link
              href="/new-post"
              className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-accent-hover"
            >
              + Publier
            </Link>
          </div>
        </div>
      )}

      {/* Not an artist CTA */}
      {!isArtist && (
        <div className="mb-8 flex items-center justify-between rounded-2xl border border-card-border bg-card px-6 py-4">
          <div>
            <p className="font-semibold text-foreground">Vous êtes tatoueur ?</p>
            <p className="text-sm text-muted">Créez votre vitrine professionnelle.</p>
          </div>
          <Link
            href="/become-artist"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-background transition-colors hover:bg-accent-hover"
          >
            Devenir artiste
          </Link>
        </div>
      )}

      {/* Discovery feed */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-foreground">
          Dernières réalisations
        </h2>
        <Link href="/explore" className="text-sm text-accent hover:text-accent-hover">
          Explorer tout &rarr;
        </Link>
      </div>

      {artworks.length === 0 ? (
        <div className="py-16 text-center">
          <TattooMachine className="mx-auto mb-4 h-14 w-14 text-accent/20" />
          <p className="text-muted">Aucune réalisation pour le moment.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {artworks.map((artwork) => (
            <PostCard
              key={artwork.id}
              artwork={{
                id: artwork.id,
                imageUrl: artwork.imageUrl,
                title: artwork.title,
                description: artwork.description,
                styles: artwork.styles,
                createdAt: artwork.createdAt,
                artistName: artwork.artist.shopName ?? artwork.artist.user.name ?? 'Artiste',
                artistId: artwork.artist.id,
                artistCity: artwork.artist.city,
              }}
            />
          ))}
        </div>
      )}

      <OrnamentDivider className="mx-auto mt-12 w-48 text-accent/10" />
    </div>
  );
}
