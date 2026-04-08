'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function toggleLike(artworkId: string) {
  const session = await getSession();
  if (!session?.user?.id) return;

  const existing = await prisma.like.findUnique({
    where: { artworkId_userId: { artworkId, userId: session.user.id } },
  });

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
  } else {
    await prisma.like.create({
      data: { artworkId, userId: session.user.id },
    });
  }
}
