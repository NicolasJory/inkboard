'use client';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { TattooMachine } from '@/components/icons';

export function UserNav() {
  const { data: session } = useSession();

  return (
    <nav className="flex items-center justify-between border-b border-card-border px-6 py-4 md:px-12">
      <Link href="/dashboard" className="flex items-center gap-2">
        <TattooMachine className="h-6 w-6 text-accent" />
        <span className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight">
          Ink<span className="text-accent">Board</span>
        </span>
      </Link>

      <div className="flex items-center gap-6">
        <Link
          href="/dashboard"
          className="text-sm text-muted transition-colors hover:text-foreground"
        >
          Dashboard
        </Link>
        {session?.user?.role === 'ARTIST' && (
          <Link
            href="/profile"
            className="text-sm text-muted transition-colors hover:text-foreground"
          >
            Mon profil
          </Link>
        )}
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted">{session?.user?.name ?? session?.user?.email}</span>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="rounded-lg border border-card-border px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-error hover:text-error"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </nav>
  );
}
