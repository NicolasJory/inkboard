'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateProfile } from './actions';

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

interface ProfileFormProps {
  user: { name: string | null };
  artist: {
    shopName: string | null;
    city: string | null;
    bio: string | null;
    website: string | null;
    styles: string[];
  };
}

export function ProfileForm({ user, artist }: ProfileFormProps) {
  const router = useRouter();
  const [selectedStyles, setSelectedStyles] = useState<string[]>(artist.styles);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  function toggleStyle(style: string) {
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style],
    );
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setSaved(false);
    formData.set('styles', selectedStyles.join(','));

    const result = await updateProfile(formData);

    if (result.success) {
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 3000);
    }
    setLoading(false);
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="rounded-2xl border border-card-border bg-card p-6">
        <h2 className="mb-4 font-[family-name:var(--font-display)] text-lg font-semibold text-foreground">
          Informations
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-muted">
              Nom
            </label>
            <input
              id="name"
              name="name"
              type="text"
              defaultValue={user.name ?? ''}
              className="w-full rounded-lg border border-card-border bg-background px-4 py-2.5 text-foreground placeholder-muted/50 transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          <div>
            <label htmlFor="shopName" className="mb-1.5 block text-sm font-medium text-muted">
              Nom du studio
            </label>
            <input
              id="shopName"
              name="shopName"
              type="text"
              defaultValue={artist.shopName ?? ''}
              className="w-full rounded-lg border border-card-border bg-background px-4 py-2.5 text-foreground placeholder-muted/50 transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          <div>
            <label htmlFor="city" className="mb-1.5 block text-sm font-medium text-muted">
              Ville
            </label>
            <input
              id="city"
              name="city"
              type="text"
              defaultValue={artist.city ?? ''}
              className="w-full rounded-lg border border-card-border bg-background px-4 py-2.5 text-foreground placeholder-muted/50 transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          <div>
            <label htmlFor="website" className="mb-1.5 block text-sm font-medium text-muted">
              Site web
            </label>
            <input
              id="website"
              name="website"
              type="url"
              defaultValue={artist.website ?? ''}
              className="w-full rounded-lg border border-card-border bg-background px-4 py-2.5 text-foreground placeholder-muted/50 transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              placeholder="https://..."
            />
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="bio" className="mb-1.5 block text-sm font-medium text-muted">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={3}
            defaultValue={artist.bio ?? ''}
            className="w-full rounded-lg border border-card-border bg-background px-4 py-2.5 text-foreground placeholder-muted/50 transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
      </div>

      {/* Styles */}
      <div className="rounded-2xl border border-card-border bg-card p-6">
        <h2 className="mb-4 font-[family-name:var(--font-display)] text-lg font-semibold text-foreground">
          Styles
        </h2>
        <div className="flex flex-wrap gap-2">
          {STYLE_OPTIONS.map((style) => (
            <button
              key={style}
              type="button"
              onClick={() => toggleStyle(style)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                selectedStyles.includes(style)
                  ? 'border-accent bg-accent text-background'
                  : 'border-card-border text-muted hover:border-accent/40 hover:text-foreground'
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-accent px-8 py-3 font-semibold text-background transition-colors hover:bg-accent-hover disabled:opacity-50"
        >
          {loading ? 'Enregistrement...' : 'Enregistrer'}
        </button>
        {saved && <span className="text-sm text-success">Profil mis à jour !</span>}
      </div>
    </form>
  );
}
