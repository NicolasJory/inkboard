'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { becomeArtist } from './actions';
import { TattooMachine, OrnamentDivider } from '@/components/icons';

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

export default function BecomeArtistPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);

  function toggleStyle(style: string) {
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style],
    );
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError('');

    formData.set('styles', selectedStyles.join(','));
    const result = await becomeArtist(formData);

    if (result.success) {
      router.push('/dashboard');
      router.refresh();
    } else {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 text-center">
        <TattooMachine className="mx-auto mb-4 h-12 w-12 text-accent" />
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-foreground">
          Devenir artiste
        </h1>
        <p className="mt-2 text-muted">
          Créez votre profil professionnel et commencez à recevoir des clients.
        </p>
        <OrnamentDivider className="mx-auto mt-4 w-48 text-accent/20" />
      </div>

      <form action={handleSubmit} className="space-y-6">
        {/* SIRET */}
        <div className="rounded-2xl border border-card-border bg-card p-6">
          <h2 className="mb-1 font-[family-name:var(--font-display)] text-lg font-semibold text-foreground">
            Vérification professionnelle
          </h2>
          <p className="mb-4 text-sm text-muted">
            Votre numéro SIRET permet de vérifier votre statut de professionnel.
          </p>
          <div>
            <label htmlFor="siret" className="mb-1.5 block text-sm font-medium text-muted">
              Numéro SIRET (14 chiffres)
            </label>
            <input
              id="siret"
              name="siret"
              type="text"
              required
              maxLength={14}
              pattern="\d{14}"
              className="w-full rounded-lg border border-card-border bg-background px-4 py-2.5 font-mono text-foreground tracking-wider placeholder-muted/50 transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              placeholder="12345678901234"
            />
          </div>
        </div>

        {/* Infos */}
        <div className="rounded-2xl border border-card-border bg-card p-6">
          <h2 className="mb-4 font-[family-name:var(--font-display)] text-lg font-semibold text-foreground">
            Votre studio
          </h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="shopName" className="mb-1.5 block text-sm font-medium text-muted">
                Nom du studio / artiste
              </label>
              <input
                id="shopName"
                name="shopName"
                type="text"
                className="w-full rounded-lg border border-card-border bg-background px-4 py-2.5 text-foreground placeholder-muted/50 transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                placeholder="Ex: Black Ink Studio"
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
                className="w-full rounded-lg border border-card-border bg-background px-4 py-2.5 text-foreground placeholder-muted/50 transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                placeholder="Ex: Paris"
              />
            </div>

            <div>
              <label htmlFor="bio" className="mb-1.5 block text-sm font-medium text-muted">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={3}
                className="w-full rounded-lg border border-card-border bg-background px-4 py-2.5 text-foreground placeholder-muted/50 transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                placeholder="Parlez de votre parcours, votre style..."
              />
            </div>
          </div>
        </div>

        {/* Styles */}
        <div className="rounded-2xl border border-card-border bg-card p-6">
          <h2 className="mb-1 font-[family-name:var(--font-display)] text-lg font-semibold text-foreground">
            Styles de tatouage
          </h2>
          <p className="mb-4 text-sm text-muted">Sélectionnez vos spécialités.</p>
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

        {error && <div className="rounded-lg bg-error/10 p-3 text-sm text-error">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-accent px-6 py-3.5 font-semibold text-background transition-colors hover:bg-accent-hover disabled:opacity-50"
        >
          {loading ? 'Création du profil...' : 'Créer mon profil artiste'}
        </button>
      </form>
    </div>
  );
}
