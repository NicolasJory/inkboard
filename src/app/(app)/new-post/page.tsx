'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { uploadArtwork } from '@/app/(app)/profile/actions';

const STYLE_OPTIONS = [
  'Réaliste',
  'Old School',
  'New School',
  'Japonais',
  'Tribal',
  'Géométrique',
  'Aquarelle',
  'Minimaliste',
  'Dotwork',
  'Blackwork',
  'Lettering',
  'Neo-traditionnel',
];

export default function NewPostPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  }

  function toggleStyle(style: string) {
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style],
    );
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError('');
    formData.set('styles', selectedStyles.join(','));

    const result = await uploadArtwork(formData);

    if (result.success) {
      router.push('/dashboard');
      router.refresh();
    } else {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 font-[family-name:var(--font-display)] text-2xl font-bold text-foreground">
        Nouveau post
      </h1>

      <form action={handleSubmit} className="space-y-4">
        {/* Image picker */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="group relative cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed border-card-border transition-colors hover:border-accent/40"
        >
          {preview ? (
            <div className="relative aspect-square">
              <Image src={preview} alt="Preview" fill className="object-cover" sizes="512px" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="text-sm font-medium text-white">Changer</span>
              </div>
            </div>
          ) : (
            <div className="flex aspect-square flex-col items-center justify-center">
              <svg
                className="mb-3 h-12 w-12 text-muted/30"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
              <p className="text-sm text-muted">Cliquez pour ajouter une photo</p>
              <p className="mt-1 text-xs text-muted/50">JPG, PNG — max 5 Mo</p>
            </div>
          )}
          <input
            ref={fileInputRef}
            name="file"
            type="file"
            accept="image/*"
            required
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Title */}
        <div>
          <input
            name="title"
            type="text"
            className="w-full border-b border-card-border bg-transparent px-1 py-3 text-foreground placeholder-muted/50 transition-colors focus:border-accent focus:outline-none"
            placeholder="Titre (optionnel)"
          />
        </div>

        {/* Description */}
        <div>
          <textarea
            name="description"
            rows={3}
            className="w-full border-b border-card-border bg-transparent px-1 py-3 text-foreground placeholder-muted/50 transition-colors focus:border-accent focus:outline-none"
            placeholder="Décrivez votre réalisation..."
          />
        </div>

        {/* Styles */}
        <div>
          <p className="mb-2 text-sm font-medium text-muted">Styles</p>
          <div className="flex flex-wrap gap-2">
            {STYLE_OPTIONS.map((style) => (
              <button
                key={style}
                type="button"
                onClick={() => toggleStyle(style)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  selectedStyles.includes(style)
                    ? 'border-accent bg-accent text-background'
                    : 'border-card-border text-muted hover:border-accent/40'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-error">{error}</p>}

        <button
          type="submit"
          disabled={loading || !preview}
          className="w-full rounded-xl bg-accent px-6 py-3 font-semibold text-background transition-colors hover:bg-accent-hover disabled:opacity-50"
        >
          {loading ? 'Publication...' : 'Publier'}
        </button>
      </form>
    </div>
  );
}
