'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { uploadArtwork, deleteArtwork } from './actions';

interface Artwork {
  id: string;
  imageUrl: string;
  title: string | null;
  description: string | null;
  styles: string[];
  createdAt: Date;
}

export function PortfolioSection({ artworks }: { artworks: Artwork[] }) {
  const router = useRouter();
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleUpload(formData: FormData) {
    setUploading(true);
    setError('');

    const result = await uploadArtwork(formData);

    if (result.success) {
      setShowUpload(false);
      router.refresh();
    } else {
      setError(result.error);
    }
    setUploading(false);
  }

  async function handleDelete(id: string) {
    const result = await deleteArtwork(id);
    if (result.success) {
      router.refresh();
    }
  }

  return (
    <div id="portfolio">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground">
          Portfolio
        </h2>
        <button
          onClick={() => setShowUpload(!showUpload)}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-background transition-colors hover:bg-accent-hover"
        >
          {showUpload ? 'Annuler' : '+ Ajouter'}
        </button>
      </div>

      {/* Upload form */}
      {showUpload && (
        <form
          action={handleUpload}
          className="mb-8 rounded-2xl border border-card-border bg-card p-6"
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="file" className="mb-1.5 block text-sm font-medium text-muted">
                Image (max 5 Mo)
              </label>
              <input
                id="file"
                name="file"
                type="file"
                required
                accept="image/*"
                className="w-full text-sm text-muted file:mr-4 file:rounded-lg file:border-0 file:bg-accent file:px-4 file:py-2 file:text-sm file:font-semibold file:text-background hover:file:bg-accent-hover"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-muted">
                  Titre
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  className="w-full rounded-lg border border-card-border bg-background px-4 py-2.5 text-foreground placeholder-muted/50 transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  placeholder="Ex: Serpent japonais"
                />
              </div>
              <div>
                <label htmlFor="styles" className="mb-1.5 block text-sm font-medium text-muted">
                  Styles (séparés par des virgules)
                </label>
                <input
                  id="styles"
                  name="styles"
                  type="text"
                  className="w-full rounded-lg border border-card-border bg-background px-4 py-2.5 text-foreground placeholder-muted/50 transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  placeholder="Japonais, Blackwork"
                />
              </div>
            </div>
            <div>
              <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-muted">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={2}
                className="w-full rounded-lg border border-card-border bg-background px-4 py-2.5 text-foreground placeholder-muted/50 transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>

            {error && <p className="text-sm text-error">{error}</p>}

            <button
              type="submit"
              disabled={uploading}
              className="rounded-lg bg-accent px-6 py-2.5 font-semibold text-background transition-colors hover:bg-accent-hover disabled:opacity-50"
            >
              {uploading ? 'Upload...' : 'Publier'}
            </button>
          </div>
        </form>
      )}

      {/* Gallery */}
      {artworks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-card-border py-16 text-center">
          <p className="text-muted">Aucune oeuvre pour le moment.</p>
          <p className="mt-1 text-sm text-muted/60">
            Ajoutez vos premières photos pour créer votre portfolio.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {artworks.map((artwork) => (
            <div
              key={artwork.id}
              className="group relative overflow-hidden rounded-xl border border-card-border bg-card"
            >
              <div className="relative aspect-square">
                <Image
                  src={artwork.imageUrl}
                  alt={artwork.title ?? 'Artwork'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="w-full p-4">
                    {artwork.title && <p className="font-semibold text-white">{artwork.title}</p>}
                    {artwork.styles.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {artwork.styles.map((style) => (
                          <span
                            key={style}
                            className="rounded-full bg-accent/20 px-2 py-0.5 text-xs text-accent"
                          >
                            {style}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {/* Delete button */}
                <button
                  onClick={() => handleDelete(artwork.id)}
                  className="absolute right-2 top-2 rounded-full bg-black/50 p-1.5 text-white opacity-0 transition-opacity hover:bg-error group-hover:opacity-100"
                >
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
