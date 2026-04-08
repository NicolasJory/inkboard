import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { TattooMachine, OrnamentDivider } from '@/components/icons';

export default async function ArtistPublicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const artist = await prisma.artist.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, image: true } },
      portfolio: { orderBy: { createdAt: 'desc' } },
    },
  });

  if (!artist || !artist.verified) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 md:px-12">
        <Link href="/" className="flex items-center gap-2">
          <TattooMachine className="h-6 w-6 text-accent" />
          <span className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight">
            Ink<span className="text-accent">Board</span>
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/explore"
            className="rounded-lg px-4 py-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
          >
            Explorer
          </Link>
          <Link
            href="/login"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-background transition-colors hover:bg-accent-hover"
          >
            Connexion
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl px-6 py-8 md:px-12">
        {/* Header */}
        <div className="mb-10 flex flex-col items-start gap-6 md:flex-row md:items-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-card-border bg-card">
            {artist.user.image ? (
              <Image
                src={artist.user.image}
                alt=""
                width={80}
                height={80}
                className="rounded-full object-cover"
              />
            ) : (
              <TattooMachine className="h-8 w-8 text-accent" />
            )}
          </div>
          <div className="flex-1">
            <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-foreground">
              {artist.shopName ?? artist.user.name ?? 'Artiste'}
            </h1>
            {artist.user.name && artist.shopName && (
              <p className="mt-0.5 text-muted">{artist.user.name}</p>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted">
              {artist.city && <span>📍 {artist.city}</span>}
              {artist.website && (
                <a
                  href={artist.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent transition-colors hover:text-accent-hover"
                >
                  🔗 Site web
                </a>
              )}
              <span>
                {artist.portfolio.length} oeuvre{artist.portfolio.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
          <Link
            href={`/artist/${artist.id}/book`}
            className="rounded-xl bg-accent px-6 py-3 font-semibold text-background transition-colors hover:bg-accent-hover"
          >
            Prendre rendez-vous
          </Link>
        </div>

        {/* Bio */}
        {artist.bio && (
          <div className="mb-8 rounded-2xl border border-card-border bg-card p-6">
            <p className="leading-relaxed text-foreground">{artist.bio}</p>
          </div>
        )}

        {/* Styles */}
        {artist.styles.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            {artist.styles.map((style) => (
              <Link
                key={style}
                href={`/explore?style=${encodeURIComponent(style)}`}
                className="rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent transition-colors hover:bg-accent/20"
              >
                {style}
              </Link>
            ))}
          </div>
        )}

        <OrnamentDivider className="mx-auto mb-10 w-48 text-accent/15" />

        {/* Portfolio */}
        <h2 className="mb-6 font-[family-name:var(--font-display)] text-2xl font-bold text-foreground">
          Portfolio
        </h2>

        {artist.portfolio.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-card-border py-16 text-center">
            <p className="text-muted">Pas encore d&apos;oeuvres publiées.</p>
          </div>
        ) : (
          <div className="columns-2 gap-4 md:columns-3">
            {artist.portfolio.map((artwork) => (
              <div
                key={artwork.id}
                className="group mb-4 break-inside-avoid overflow-hidden rounded-xl border border-card-border bg-card"
              >
                <div className="relative">
                  <Image
                    src={artwork.imageUrl}
                    alt={artwork.title ?? 'Artwork'}
                    width={600}
                    height={600}
                    className="w-full object-cover"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="w-full p-3">
                      {artwork.title && (
                        <p className="text-sm font-semibold text-white">{artwork.title}</p>
                      )}
                      {artwork.styles.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {artwork.styles.map((s) => (
                            <span
                              key={s}
                              className="rounded-full bg-accent/20 px-2 py-0.5 text-xs text-accent"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
