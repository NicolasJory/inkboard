'use client';

import { useState, useRef } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { sendOtp } from './actions';
import { TattooMachine, OrnamentDivider } from '@/components/icons';

type Step = 'email' | 'otp';

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  async function handleEmailSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const result = await sendOtp(formData);

    if (result.success) {
      setEmail(formData.get('email') as string);
      setStep('otp');
    } else {
      setError(result.error ?? "Erreur lors de l'envoi.");
    }
    setLoading(false);
  }

  function handleOtpChange(index: number, value: string) {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits are filled
    if (value && index === 5) {
      const code = newOtp.join('');
      if (code.length === 6) {
        handleOtpSubmit(code);
      }
    }
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handleOtpPaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      const newOtp = pasted.split('');
      setOtp(newOtp);
      handleOtpSubmit(pasted);
    }
  }

  async function handleOtpSubmit(code: string) {
    setLoading(true);
    setError('');

    const result = await signIn('otp', {
      email,
      code,
      redirect: false,
    });

    if (result?.error) {
      setError('Code invalide ou expiré.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  }

  async function handleResend() {
    setError('');
    const formData = new FormData();
    formData.set('email', email);
    const result = await sendOtp(formData);
    if (!result.success) {
      setError(result.error ?? 'Erreur.');
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      {/* Decorative background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <TattooMachine className="mx-auto mb-3 h-8 w-8 text-accent" />
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight text-foreground">
            Ink<span className="text-accent">Board</span>
          </h1>
          <p className="mt-2 text-sm text-muted">L&apos;espace des tatoueurs professionnels</p>
          <OrnamentDivider className="mx-auto mt-4 w-40 text-accent/20" />
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-card-border bg-card p-8">
          {step === 'email' ? (
            <>
              <h2 className="mb-2 font-[family-name:var(--font-display)] text-xl font-semibold text-foreground">
                Connexion / Inscription
              </h2>
              <p className="mb-6 text-sm text-muted">
                Entrez votre email pour recevoir un code de connexion.
              </p>

              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-muted">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoFocus
                    className="w-full rounded-lg border border-card-border bg-background px-4 py-2.5 text-foreground placeholder-muted/50 transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    placeholder="votre@email.com"
                  />
                </div>

                {error && <p className="text-sm text-error">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-accent px-4 py-2.5 font-semibold text-background transition-colors hover:bg-accent-hover disabled:opacity-50"
                >
                  {loading ? 'Envoi...' : 'Recevoir un code'}
                </button>
              </form>

              {/* Divider */}
              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-card-border" />
                <span className="text-xs uppercase tracking-wider text-muted">ou</span>
                <div className="h-px flex-1 bg-card-border" />
              </div>

              <button
                onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-card-border bg-background px-4 py-2.5 font-medium text-foreground transition-colors hover:border-muted"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continuer avec Google
              </button>
            </>
          ) : (
            <>
              <h2 className="mb-2 font-[family-name:var(--font-display)] text-xl font-semibold text-foreground">
                Vérification
              </h2>
              <p className="mb-6 text-sm text-muted">
                Code envoyé à <span className="font-medium text-foreground">{email}</span>
              </p>

              {/* OTP Input */}
              <div className="flex justify-center gap-3" onPaste={handleOtpPaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      inputRefs.current[i] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    autoFocus={i === 0}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="h-14 w-11 rounded-lg border border-card-border bg-background text-center text-xl font-bold text-foreground transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                ))}
              </div>

              {error && <p className="mt-4 text-center text-sm text-error">{error}</p>}

              {loading && <p className="mt-4 text-center text-sm text-muted">Vérification...</p>}

              <div className="mt-6 flex items-center justify-between">
                <button
                  onClick={() => {
                    setStep('email');
                    setOtp(['', '', '', '', '', '']);
                    setError('');
                  }}
                  className="text-sm text-muted transition-colors hover:text-foreground"
                >
                  &larr; Changer d&apos;email
                </button>
                <button
                  onClick={handleResend}
                  className="text-sm text-accent transition-colors hover:text-accent-hover"
                >
                  Renvoyer le code
                </button>
              </div>
            </>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-muted/60">
          Plateforme réservée aux professionnels du tatouage
        </p>
      </div>
    </div>
  );
}
