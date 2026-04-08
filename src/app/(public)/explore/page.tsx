import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { TattooMachine, OrnamentDivider } from '@/components/icons';
import { SearchFilters } from './search-filters';

interface SearchParams {
  style?: string;
  city?: string;
}

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const { style, city } = params;

  const artists = await prisma.artist.findMany({
    where: {
      verified: true,
      ...(style ? { styles: { has: style } } : {}),
      ...(city ? { city: { contains: city, mode: 'insensitive' as const } } : {}),
    },
    include: {
      user: { select: { name: true, image: true } },
      portfolio: { take: 3, orderBy: { createdAt: 'desc' } },
      _count: { select: { portfolio: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Get all unique styles and cities for filters
  const allArtists = await prisma.artist.findMany({
    where: { verified: true },
    select: { styles: true, city: true },
  });

  const allStyles = [...new Set(allArtists.flatMap((a) => a.styles))].sort();
  const allCities = [...new Set(allArtists.map((a) => a.city).filter(Boolean) as string[])].sort();

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
        <Link
          href="/login"
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-background transition-colors hover:bg-accent-hover"
        >
          Connexion
        </Link>
      </nav>

      <div className="mx-auto max-w-6xl px-6 py-8 md:px-12">
        <div className="mb-8 text-center">
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold text-foreground">
            Trouvez votre <span className="italic text-accent">artiste</span>
          </h1>
          <p className="mt-2 text-muted">
            Explorez les portfolios de tatoueurs professionnels vérifiés.
          </p>
          <OrnamentDivider className="mx-auto mt-4 w-48 text-accent/20" />
        </div>

        {/* Filters */}
        <SearchFilters
          styles={allStyles}
          cities={allCities}
          currentStyle={style}
          currentCity={city}
        />

        {/* Results */}
        {artists.length === 0 ? (
          <div className="py-20 text-center">
            <TattooMachine className="mx-auto mb-4 h-12 w-12 text-muted/30" />
            <p className="text-lg text-muted">Aucun artiste trouvé.</p>
            <p className="mt-1 text-sm text-muted/60">Essayez avec d&apos;autres filtres.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {artists.map((artist) => (
              <Link
                key={artist.id}
                href={`/artist/${artist.id}`}
                className="group overflow-hidden rounded-2xl border border-card-border bg-card transition-all hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5"
              >
                {/* Preview images */}
                <div className="grid h-48 grid-cols-3 gap-0.5 overflow-hidden">
                  {artist.portfolio.length > 0 ? (
                    artist.portfolio.map((artwork) => (
                      <div key={artwork.id} className="relative overflow-hidden">
                        <Image
                          src={artwork.imageUrl}
                          alt={artwork.title ?? ''}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                          sizes="(max-width: 768px) 33vw, 20vw"
                        />
                      </div>
                    ))
                  ) : (
                    <div className="col-span-3 flex items-center justify-center bg-card-border/20">
                      <TattooMachine className="h-10 w-10 text-muted/20" />
                    </div>
                  )}
                  {/* Fill empty slots */}
                  {artist.portfolio.length > 0 &&
                    artist.portfolio.length < 3 &&
                    Array.from({ length: 3 - artist.portfolio.length }).map((_, i) => (
                      <div key={`empty-${i}`} className="bg-card-border/20" />
                    ))}
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-foreground">
                    {artist.shopName ?? artist.user.name ?? 'Artiste'}
                  </h3>
                  {artist.city && <p className="mt-0.5 text-sm text-muted">📍 {artist.city}</p>}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {artist.styles.slice(0, 4).map((s) => (
                      <span
                        key={s}
                        className="rounded-full border border-card-border px-2.5 py-0.5 text-xs text-muted"
                      >
                        {s}
                      </span>
                    ))}
                    {artist.styles.length > 4 && (
                      <span className="rounded-full border border-card-border px-2.5 py-0.5 text-xs text-muted">
                        +{artist.styles.length - 4}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-muted/60">
                    {artist._count.portfolio} oeuvre{artist._count.portfolio !== 1 ? 's' : ''}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
