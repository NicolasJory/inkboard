'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

type ActionResult = { success: true } | { success: false; error: string };

export async function updateBookingStatus(
  bookingId: string,
  status: 'CONFIRMED' | 'CANCELLED',
): Promise<ActionResult> {
  const session = await getSession();
  if (!session?.user?.id) return { success: false, error: 'Non connecté.' };

  const artist = await prisma.artist.findUnique({ where: { userId: session.user.id } });
  if (!artist) return { success: false, error: 'Profil artiste introuvable.' };

  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking || booking.artistId !== artist.id) {
    return { success: false, error: 'Rendez-vous introuvable.' };
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: { status },
  });

  return { success: true };
}
