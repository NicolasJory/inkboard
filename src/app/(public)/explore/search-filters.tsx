'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

interface SearchFiltersProps {
  styles: string[];
  cities: string[];
  currentStyle?: string;
  currentCity?: string;
}

export function SearchFilters({ styles, cities, currentStyle, currentCity }: SearchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/explore?${params.toString()}`);
    },
    [router, searchParams],
  );

  const hasFilters = currentStyle || currentCity;

  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Style filter */}
        <select
          value={currentStyle ?? ''}
          onChange={(e) => updateFilter('style', e.target.value)}
          className="rounded-lg border border-card-border bg-card px-4 py-2 text-sm text-foreground transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        >
          <option value="">Tous les styles</option>
          {styles.map((style) => (
            <option key={style} value={style}>
              {style}
            </option>
          ))}
        </select>

        {/* City filter */}
        <select
          value={currentCity ?? ''}
          onChange={(e) => updateFilter('city', e.target.value)}
          className="rounded-lg border border-card-border bg-card px-4 py-2 text-sm text-foreground transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        >
          <option value="">Toutes les villes</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>

        {hasFilters && (
          <button
            onClick={() => router.push('/explore')}
            className="rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:text-foreground"
          >
            Effacer les filtres
          </button>
        )}
      </div>
    </div>
  );
}
