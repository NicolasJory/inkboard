import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const OTP_LENGTH = 6;
const OTP_EXPIRY_MINUTES = 10;

export function generateOtp(): string {
  const digits = '0123456789';
  let code = '';
  for (let i = 0; i < OTP_LENGTH; i++) {
    code += digits[Math.floor(Math.random() * digits.length)];
  }
  return code;
}

export async function createAndSendOtp(email: string): Promise<{ success: boolean }> {
  // Invalidate previous codes for this email
  await prisma.otpCode.updateMany({
    where: { email, used: false },
    data: { used: true },
  });

  const code = generateOtp();
  const expires = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  await prisma.otpCode.create({
    data: { email, code, expires },
  });

  // In dev, log the code to console
  if (process.env.NODE_ENV === 'development') {
    console.log(`\n🔑 OTP for ${email}: ${code}\n`);
  }

  // Send email via Resend
  if (process.env.RESEND_API_KEY) {
    await resend.emails.send({
      from: process.env.EMAIL_FROM ?? 'InkBoard <onboarding@resend.dev>',
      to: email,
      subject: `Votre code InkBoard : ${code}`,
      html: `
        <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto; padding: 32px;">
          <h1 style="font-size: 24px; color: #1a1a1a;">InkBoard</h1>
          <p style="color: #555; font-size: 16px;">Votre code de connexion :</p>
          <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #c8a45a; padding: 16px 0;">
            ${code}
          </div>
          <p style="color: #888; font-size: 13px;">
            Ce code expire dans ${OTP_EXPIRY_MINUTES} minutes.
            Si vous n'avez pas demandé ce code, ignorez cet email.
          </p>
        </div>
      `,
    });
  }

  return { success: true };
}

export async function verifyOtp(email: string, code: string): Promise<boolean> {
  const otp = await prisma.otpCode.findFirst({
    where: {
      email,
      code,
      used: false,
      expires: { gt: new Date() },
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!otp) return false;

  await prisma.otpCode.update({
    where: { id: otp.id },
    data: { used: true },
  });

  return true;
}
