'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { createBooking } from './actions';
import { TattooMachine, OrnamentDivider } from '@/components/icons';

export default function BookArtistPage() {
  const params = useParams();
  const artistId = params.id as string;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError('');

    formData.set('artistId', artistId);
    const result = await createBooking(formData);

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error);
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="max-w-md text-center">
          <TattooMachine className="mx-auto mb-4 h-12 w-12 text-accent" />
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground">
            Demande envoyée !
          </h1>
          <p className="mt-2 text-muted">
            L&apos;artiste a été notifié. Vous recevrez une réponse prochainement.
          </p>
          <OrnamentDivider className="mx-auto my-6 w-40 text-accent/20" />
          <div className="flex justify-center gap-3">
            <Link
              href={`/artist/${artistId}`}
              className="rounded-lg border border-card-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-muted"
            >
              Retour au profil
            </Link>
            <Link
              href="/explore"
              className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-background transition-colors hover:bg-accent-hover"
            >
              Explorer
            </Link>
          </div>
        </div>
      </div>
    );
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
      </nav>

      <div className="mx-auto max-w-lg px-6 py-8">
        <div className="mb-8 text-center">
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-foreground">
            Prendre <span className="italic text-accent">rendez-vous</span>
          </h1>
          <p className="mt-2 text-muted">Décrivez votre projet de tatouage.</p>
          <OrnamentDivider className="mx-auto mt-4 w-40 text-accent/20" />
        </div>

        <form action={handleSubmit} className="space-y-6">
          <div className="rounded-2xl border border-card-border bg-card p-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="date" className="mb-1.5 block text-sm font-medium text-muted">
                  Date souhaitée
                </label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full rounded-lg border border-card-border bg-background px-4 py-2.5 text-foreground transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="mb-1.5 block text-sm font-medium text-muted"
                >
                  Décrivez votre projet
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  className="w-full rounded-lg border border-card-border bg-background px-4 py-2.5 text-foreground placeholder-muted/50 transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  placeholder="Style souhaité, emplacement, taille approximative, références..."
                />
              </div>
            </div>
          </div>

          {error && <div className="rounded-lg bg-error/10 p-3 text-sm text-error">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-accent px-6 py-3.5 font-semibold text-background transition-colors hover:bg-accent-hover disabled:opacity-50"
          >
            {loading ? 'Envoi...' : 'Envoyer ma demande'}
          </button>

          <p className="text-center text-xs text-muted/60">
            Vous devez être connecté pour envoyer une demande.
          </p>
        </form>
      </div>
    </div>
  );
}
