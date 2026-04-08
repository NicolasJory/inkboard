import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { TattooMachine } from '@/components/icons';
import { PostCard } from '@/components/post-card';

export default async function DashboardPage() {
  const session = await getSession();
  if (!session?.user) redirect('/login');

  // Feed: latest artworks from all verified artists
  const artworks = await prisma.artwork.findMany({
    where: { artist: { verified: true } },
    include: {
      artist: {
        include: { user: { select: { name: true, image: true } } },
      },
      _count: { select: { comments: true, likes: true } },
      likes: {
        where: { userId: session.user.id },
        select: { id: true },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  if (artworks.length === 0) {
    return (
      <div className="mx-auto max-w-lg py-20 text-center">
        <TattooMachine className="mx-auto mb-4 h-14 w-14 text-accent/30" />
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground">
          Pas encore de posts
        </h2>
        <p className="mt-2 text-muted">
          {session.user.role === 'ARTIST'
            ? 'Commencez par publier votre premier tatouage !'
            : "Les artistes n'ont pas encore publié. Revenez bientôt !"}
        </p>
        {session.user.role === 'ARTIST' && (
          <Link
            href="/new-post"
            className="mt-6 inline-block rounded-xl bg-accent px-8 py-3 font-semibold text-background transition-colors hover:bg-accent-hover"
          >
            Publier
          </Link>
        )}
        {session.user.role === 'VISITOR' && (
          <Link
            href="/become-artist"
            className="mt-6 inline-block rounded-xl bg-accent px-8 py-3 font-semibold text-background transition-colors hover:bg-accent-hover"
          >
            Devenir artiste
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
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
            commentCount: artwork._count.comments,
            likeCount: artwork._count.likes,
            isLiked: artwork.likes.length > 0,
          }}
        />
      ))}
    </div>
  );
}
