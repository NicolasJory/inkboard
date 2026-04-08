'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { Resend } from 'resend';

type BookingResult = { success: true } | { success: false; error: string };

const resend = new Resend(process.env.RESEND_API_KEY);

export async function createBooking(formData: FormData): Promise<BookingResult> {
  const session = await getSession();

  if (!session?.user?.id) {
    return { success: false, error: 'Vous devez être connecté pour prendre rendez-vous.' };
  }

  const artistId = formData.get('artistId') as string;
  const date = formData.get('date') as string;
  const description = formData.get('description') as string;

  if (!artistId || !date) {
    return { success: false, error: 'Date et artiste requis.' };
  }

  const bookingDate = new Date(date);
  if (bookingDate <= new Date()) {
    return { success: false, error: 'La date doit être dans le futur.' };
  }

  const artist = await prisma.artist.findUnique({
    where: { id: artistId },
    include: { user: { select: { email: true, name: true } } },
  });

  if (!artist) {
    return { success: false, error: 'Artiste introuvable.' };
  }

  await prisma.booking.create({
    data: {
      artistId,
      userId: session.user.id,
      date: bookingDate,
      description: description || null,
      status: 'PENDING',
    },
  });

  // Notify artist by email
  if (process.env.RESEND_API_KEY) {
    try {
      await resend.emails.send({
        from: process.env.EMAIL_FROM ?? 'InkBoard <onboarding@resend.dev>',
        to: artist.user.email,
        subject: 'Nouvelle demande de rendez-vous — InkBoard',
        html: `
          <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto; padding: 32px;">
            <h1 style="font-size: 24px; color: #1a1a1a;">Nouvelle demande</h1>
            <p style="color: #555;">Vous avez reçu une demande de rendez-vous.</p>
            <p style="color: #555;"><strong>Date :</strong> ${bookingDate.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            ${description ? `<p style="color: #555;"><strong>Description :</strong> ${description}</p>` : ''}
            <p style="color: #888; font-size: 13px; margin-top: 24px;">Connectez-vous sur InkBoard pour accepter ou refuser.</p>
          </div>
        `,
      });
    } catch {
      // Email failure shouldn't block booking creation
    }
  }

  return { success: true };
}
