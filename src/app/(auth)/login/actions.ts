'use server';

import { createAndSendOtp } from '@/lib/otp';

export async function sendOtp(formData: FormData): Promise<{ success: boolean; error?: string }> {
  const email = formData.get('email') as string;

  if (!email) {
    return { success: false, error: 'Email requis.' };
  }

  try {
    await createAndSendOtp(email);
    return { success: true };
  } catch {
    return { success: false, error: "Erreur lors de l'envoi du code." };
  }
}
