'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

type BecomeArtistResult = { success: true } | { success: false; error: string };

export async function becomeArtist(formData: FormData): Promise<BecomeArtistResult> {
  const session = await getSession();

  if (!session?.user?.id) {
    return { success: false, error: 'Non connecté.' };
  }

  const siret = (formData.get('siret') as string)?.replace(/\s/g, '');
  const shopName = formData.get('shopName') as string;
  const city = formData.get('city') as string;
  const bio = formData.get('bio') as string;
  const styles = (formData.get('styles') as string)
    ?.split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  if (!siret || siret.length !== 14) {
    return { success: false, error: 'Le SIRET doit contenir exactement 14 chiffres.' };
  }

  if (!/^\d{14}$/.test(siret)) {
    return { success: false, error: 'Le SIRET ne doit contenir que des chiffres.' };
  }

  // Check if SIRET is already used
  const existingArtist = await prisma.artist.findUnique({ where: { siret } });
  if (existingArtist) {
    return { success: false, error: 'Ce SIRET est déjà utilisé par un autre artiste.' };
  }

  // Check if user is already an artist
  const existingProfile = await prisma.artist.findUnique({
    where: { userId: session.user.id },
  });
  if (existingProfile) {
    return { success: false, error: 'Vous avez déjà un profil artiste.' };
  }

  // Verify SIRET via INSEE API (if token is configured)
  let verified = false;
  const inseeToken = process.env.INSEE_API_TOKEN;

  if (inseeToken) {
    try {
      const res = await fetch(`https://api.insee.fr/entreprises/sirene/V3.11/siret/${siret}`, {
        headers: {
          Authorization: `Bearer ${inseeToken}`,
          Accept: 'application/json',
        },
      });
      verified = res.ok;
    } catch {
      // API down — we'll verify later
    }
  }

  // Create artist profile
  await prisma.artist.create({
    data: {
      userId: session.user.id,
      siret,
      shopName: shopName || null,
      city: city || null,
      bio: bio || null,
      styles: styles ?? [],
      verified,
    },
  });

  // Update user role
  await prisma.user.update({
    where: { id: session.user.id },
    data: { role: 'ARTIST' },
  });

  return { success: true };
}
