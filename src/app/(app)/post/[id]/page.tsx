import { notFound, redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { CommentForm } from './comment-form';

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session?.user) redirect('/login');

  const artwork = await prisma.artwork.findUnique({
    where: { id },
    include: {
      artist: {
        include: { user: { select: { name: true } } },
      },
      comments: {
        include: { user: { select: { name: true, email: true } } },
        orderBy: { createdAt: 'asc' },
      },
      _count: { select: { likes: true } },
    },
  });

  if (!artwork) notFound();

  return (
    <div className="mx-auto max-w-4xl">
      <div className="overflow-hidden rounded-2xl border border-card-border bg-card md:grid md:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-square">
          <Image
            src={artwork.imageUrl}
            alt={artwork.title ?? 'Artwork'}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Sidebar */}
        <div className="flex flex-col">
          {/* Artist header */}
          <div className="flex items-center gap-3 border-b border-card-border px-4 py-3">
            <Link
              href={`/artist/${artwork.artist.id}`}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-accent/30 bg-accent/10"
            >
              <span className="text-xs font-bold text-accent">
                {(artwork.artist.shopName ?? artwork.artist.user.name ?? 'A')
                  .charAt(0)
                  .toUpperCase()}
              </span>
            </Link>
            <div>
              <Link
                href={`/artist/${artwork.artist.id}`}
                className="text-sm font-semibold text-foreground hover:text-accent"
              >
                {artwork.artist.shopName ?? artwork.artist.user.name ?? 'Artiste'}
              </Link>
              {artwork.artist.city && <p className="text-xs text-muted">{artwork.artist.city}</p>}
            </div>
          </div>

          {/* Caption + Comments */}
          <div className="flex-1 overflow-y-auto px-4 py-3">
            {/* Caption */}
            {(artwork.title || artwork.description) && (
              <div className="mb-4 pb-3 border-b border-card-border">
                {artwork.title && (
                  <p className="text-sm font-semibold text-foreground">{artwork.title}</p>
                )}
                {artwork.description && (
                  <p className="mt-1 text-sm text-muted">{artwork.description}</p>
                )}
                {artwork.styles.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {artwork.styles.map((s) => (
                      <span key={s} className="text-xs text-accent">
                        #{s.replace(/\s/g, '')}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Comments */}
            <div className="space-y-3">
              {artwork.comments.length === 0 && (
                <p className="text-sm text-muted/60">Pas encore de commentaires.</p>
              )}
              {artwork.comments.map((comment) => (
                <div key={comment.id}>
                  <p className="text-sm">
                    <span className="font-semibold text-foreground">
                      {comment.user.name ?? comment.user.email}
                    </span>{' '}
                    <span className="text-foreground/80">{comment.text}</span>
                  </p>
                  <p className="mt-0.5 text-xs text-muted/50">
                    {comment.createdAt.toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="border-t border-card-border px-4 py-2">
            <p className="text-sm font-semibold text-foreground">
              {artwork._count.likes} j&apos;aime
            </p>
          </div>

          {/* Comment input */}
          <CommentForm artworkId={artwork.id} />
        </div>
      </div>
    </div>
  );
}
