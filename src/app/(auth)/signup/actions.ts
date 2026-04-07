'use server';

import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

type SignupResult = { success: true } | { success: false; error: string };

export async function signup(formData: FormData): Promise<SignupResult> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;

  if (!email || !password || !name) {
    return { success: false, error: 'Tous les champs sont requis.' };
  }

  if (password.length < 8) {
    return { success: false, error: 'Le mot de passe doit contenir au moins 8 caractères.' };
  }

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    return { success: false, error: 'Un compte existe déjà avec cet email.' };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
      role: 'VISITOR',
    },
  });

  return { success: true };
}
