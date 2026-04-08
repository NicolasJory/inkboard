'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function addComment(
  artworkId: string,
  text: string,
): Promise<{ success: boolean; error?: string }> {
  const session = await getSession();
  if (!session?.user?.id) return { success: false, error: 'Non connecté.' };

  if (!text.trim()) return { success: false, error: 'Commentaire vide.' };

  await prisma.comment.create({
    data: {
      artworkId,
      userId: session.user.id,
      text: text.trim(),
    },
  });

  return { success: true };
}
