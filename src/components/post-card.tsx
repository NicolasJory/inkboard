'use client';

import Image from 'next/image';
import Link from 'next/link';

interface PostData {
  id: string;
  imageUrl: string;
  title: string | null;
  description: string | null;
  styles: string[];
  createdAt: Date;
  artistName: string;
  artistId: string;
  artistCity: string | null;
}

export function PostCard({ artwork }: { artwork: PostData }) {
  const timeAgo = getTimeAgo(new Date(artwork.createdAt));

  return (
    <article className="overflow-hidden rounded-2xl border border-card-border bg-card">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <Link
          href={`/artist/${artwork.artistId}`}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-accent/30 bg-accent/10"
        >
          <span className="text-xs font-bold text-accent">
            {artwork.artistName.charAt(0).toUpperCase()}
          </span>
        </Link>
        <div className="flex-1">
          <Link
            href={`/artist/${artwork.artistId}`}
            className="text-sm font-semibold text-foreground hover:text-accent"
          >
            {artwork.artistName}
          </Link>
          {artwork.artistCity && <p className="text-xs text-muted">{artwork.artistCity}</p>}
        </div>
        <span className="text-xs text-muted">{timeAgo}</span>
      </div>

      {/* Image */}
      <Link href={`/artist/${artwork.artistId}`} className="block">
        <div className="relative aspect-square">
          <Image
            src={artwork.imageUrl}
            alt={artwork.title ?? 'Tattoo'}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 512px"
          />
        </div>
      </Link>

      {/* Info */}
      <div className="px-4 py-3">
        {artwork.title && (
          <p className="text-sm">
            <span className="font-semibold text-foreground">{artwork.artistName}</span>{' '}
            <span className="text-foreground/80">{artwork.title}</span>
          </p>
        )}
        {artwork.description && <p className="mt-0.5 text-sm text-muted">{artwork.description}</p>}

        {/* Tags */}
        {artwork.styles.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {artwork.styles.map((style) => (
              <Link
                key={style}
                href={`/explore?style=${encodeURIComponent(style)}`}
                className="text-xs text-accent hover:text-accent-hover"
              >
                #{style.replace(/\s/g, '')}
              </Link>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-3 flex items-center gap-2">
          <Link
            href={`/artist/${artwork.artistId}`}
            className="rounded-lg border border-card-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            Voir le profil
          </Link>
          <Link
            href={`/artist/${artwork.artistId}/book`}
            className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-background transition-colors hover:bg-accent-hover"
          >
            Prendre RDV
          </Link>
        </div>
      </div>
    </article>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "à l'instant";
  if (diffMins < 60) return `${diffMins}min`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}j`;
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}
