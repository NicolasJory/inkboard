import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { TattooMachine, OrnamentDivider } from '@/components/icons';

export default async function ProfilePage() {
  const session = await getSession();
  if (!session?.user?.id) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      artist: {
        include: {
          portfolio: { orderBy: { createdAt: 'desc' } },
          _count: { select: { portfolio: true, bookings: true } },
        },
      },
    },
  });

  if (!user) redirect('/login');

  // Not an artist yet
  if (!user.artist) {
    return (
      <div className="mx-auto max-w-lg py-20 text-center">
        <TattooMachine className="mx-auto mb-4 h-14 w-14 text-accent/30" />
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground">
          Créez votre profil artiste
        </h2>
        <p className="mt-2 text-muted">
          Pour accéder à votre profil, vous devez d&apos;abord vous inscrire en tant
          qu&apos;artiste.
        </p>
        <Link
          href="/become-artist"
          className="mt-6 inline-block rounded-xl bg-accent px-8 py-3 font-semibold text-background transition-colors hover:bg-accent-hover"
        >
          Devenir artiste
        </Link>
      </div>
    );
  }

  const artist = user.artist;

  return (
    <div className="mx-auto max-w-4xl">
      {/* Profile header — Instagram style */}
      <div className="flex items-start gap-8 px-4 py-6 md:gap-16">
        {/* Avatar */}
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2 border-accent/30 bg-accent/10 md:h-36 md:w-36">
          <TattooMachine className="h-8 w-8 text-accent md:h-14 md:w-14" />
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-center gap-4">
            <h1 className="font-[family-name:var(--font-display)] text-xl font-bold text-foreground md:text-2xl">
              {artist.shopName ?? user.name ?? 'Artiste'}
            </h1>
            <Link
              href="/settings"
              className="rounded-lg border border-card-border px-4 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-accent"
            >
              Modifier
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-4 flex gap-8">
            <div>
              <span className="font-bold text-foreground">{artist._count.portfolio}</span>{' '}
              <span className="text-sm text-muted">posts</span>
            </div>
            <div>
              <span className="font-bold text-foreground">{artist._count.bookings}</span>{' '}
              <span className="text-sm text-muted">RDV</span>
            </div>
          </div>

          {/* Bio */}
          <div className="mt-3">
            {user.name && artist.shopName && (
              <p className="text-sm font-semibold text-foreground">{user.name}</p>
            )}
            {artist.city && <p className="text-sm text-muted">📍 {artist.city}</p>}
            {artist.bio && <p className="mt-1 text-sm text-foreground/80">{artist.bio}</p>}
            {artist.website && (
              <a
                href={artist.website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-0.5 block text-sm font-medium text-accent hover:text-accent-hover"
              >
                {artist.website.replace(/^https?:\/\//, '')}
              </a>
            )}
          </div>

          {/* Style tags */}
          {artist.styles.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {artist.styles.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-card-border px-2.5 py-0.5 text-xs text-muted"
                >
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <OrnamentDivider className="mx-auto mb-4 w-48 text-accent/10" />

      {/* Grid — Instagram style */}
      {artist.portfolio.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-muted">Aucun post pour le moment.</p>
          <Link
            href="/new-post"
            className="mt-4 inline-block rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-accent-hover"
          >
            Publier votre premier tatouage
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-1">
          {artist.portfolio.map((artwork) => (
            <Link
              key={artwork.id}
              href={`/post/${artwork.id}`}
              className="group relative aspect-square overflow-hidden"
            >
              <Image
                src={artwork.imageUrl}
                alt={artwork.title ?? ''}
                fill
                className="object-cover transition-opacity group-hover:opacity-70"
                sizes="(max-width: 768px) 33vw, 25vw"
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
