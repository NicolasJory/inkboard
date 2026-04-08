'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { toggleLike } from '@/app/(app)/dashboard/actions';

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
  commentCount: number;
  likeCount: number;
  isLiked: boolean;
}

export function PostCard({ artwork }: { artwork: PostData }) {
  const [liked, setLiked] = useState(artwork.isLiked);
  const [likeCount, setLikeCount] = useState(artwork.likeCount);

  async function handleLike() {
    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount((c) => c + (newLiked ? 1 : -1));
    await toggleLike(artwork.id);
  }

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
      <div className="relative aspect-square">
        <Image
          src={artwork.imageUrl}
          alt={artwork.title ?? 'Tattoo'}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 512px"
        />
      </div>

      {/* Actions */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-4">
          <button onClick={handleLike} className="flex items-center gap-1.5 transition-colors">
            <HeartIcon filled={liked} />
            <span className={`text-sm font-medium ${liked ? 'text-red-500' : 'text-foreground'}`}>
              {likeCount}
            </span>
          </button>
          <Link
            href={`/post/${artwork.id}`}
            className="flex items-center gap-1.5 text-foreground transition-colors hover:text-accent"
          >
            <CommentIcon />
            <span className="text-sm font-medium">{artwork.commentCount}</span>
          </Link>
        </div>

        {/* Caption */}
        <div className="mt-2">
          {artwork.title && (
            <p className="text-sm">
              <span className="font-semibold text-foreground">{artwork.artistName}</span>{' '}
              <span className="text-foreground/80">{artwork.title}</span>
            </p>
          )}
          {artwork.description && (
            <p className="mt-0.5 text-sm text-muted">{artwork.description}</p>
          )}
        </div>

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

        {/* View comments link */}
        {artwork.commentCount > 0 && (
          <Link
            href={`/post/${artwork.id}`}
            className="mt-1 block text-xs text-muted hover:text-foreground"
          >
            Voir les {artwork.commentCount} commentaire{artwork.commentCount > 1 ? 's' : ''}
          </Link>
        )}
      </div>
    </article>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      className={`h-6 w-6 transition-colors ${filled ? 'fill-red-500 text-red-500' : 'text-foreground'}`}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
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
