'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addComment } from './actions';

export function CommentForm({ artworkId }: { artworkId: string }) {
  const router = useRouter();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    const result = await addComment(artworkId, text);

    if (result.success) {
      setText('');
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 border-t border-card-border px-4 py-3"
    >
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ajouter un commentaire..."
        className="flex-1 bg-transparent text-sm text-foreground placeholder-muted/50 focus:outline-none"
      />
      <button
        type="submit"
        disabled={loading || !text.trim()}
        className="text-sm font-semibold text-accent transition-colors hover:text-accent-hover disabled:opacity-30"
      >
        Publier
      </button>
    </form>
  );
}
