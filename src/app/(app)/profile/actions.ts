'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

type ActionResult = { success: true } | { success: false; error: string };

export async function updateProfile(formData: FormData): Promise<ActionResult> {
  const session = await getSession();
  if (!session?.user?.id) return { success: false, error: 'Non connecté.' };

  const artist = await prisma.artist.findUnique({ where: { userId: session.user.id } });
  if (!artist) return { success: false, error: 'Profil artiste introuvable.' };

  const name = formData.get('name') as string;
  const shopName = formData.get('shopName') as string;
  const city = formData.get('city') as string;
  const bio = formData.get('bio') as string;
  const website = formData.get('website') as string;
  const styles = (formData.get('styles') as string)
    ?.split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name: name || null },
  });

  await prisma.artist.update({
    where: { id: artist.id },
    data: {
      shopName: shopName || null,
      city: city || null,
      bio: bio || null,
      website: website || null,
      styles: styles ?? [],
    },
  });

  return { success: true };
}

export async function uploadArtwork(formData: FormData): Promise<ActionResult> {
  const session = await getSession();
  if (!session?.user?.id) return { success: false, error: 'Non connecté.' };

  const artist = await prisma.artist.findUnique({ where: { userId: session.user.id } });
  if (!artist) return { success: false, error: 'Profil artiste introuvable.' };

  const file = formData.get('file') as File;
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const styles = (formData.get('styles') as string)
    ?.split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  if (!file || file.size === 0) {
    return { success: false, error: 'Aucun fichier sélectionné.' };
  }

  if (file.size > 5 * 1024 * 1024) {
    return { success: false, error: 'Le fichier ne doit pas dépasser 5 Mo.' };
  }

  if (!file.type.startsWith('image/')) {
    return { success: false, error: 'Seules les images sont acceptées.' };
  }

  // Save to local uploads directory (in dev — replace with S3/R2 in prod)
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  await mkdir(uploadsDir, { recursive: true });

  const ext = file.name.split('.').pop() ?? 'jpg';
  const filename = `${artist.id}-${Date.now()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(path.join(uploadsDir, filename), buffer);

  const imageUrl = `/uploads/${filename}`;

  await prisma.artwork.create({
    data: {
      artistId: artist.id,
      imageUrl,
      title: title || null,
      description: description || null,
      styles: styles ?? [],
    },
  });

  return { success: true };
}

export async function deleteArtwork(artworkId: string): Promise<ActionResult> {
  const session = await getSession();
  if (!session?.user?.id) return { success: false, error: 'Non connecté.' };

  const artist = await prisma.artist.findUnique({ where: { userId: session.user.id } });
  if (!artist) return { success: false, error: 'Profil artiste introuvable.' };

  const artwork = await prisma.artwork.findUnique({ where: { id: artworkId } });
  if (!artwork || artwork.artistId !== artist.id) {
    return { success: false, error: 'Oeuvre introuvable.' };
  }

  await prisma.artwork.delete({ where: { id: artworkId } });

  return { success: true };
}
