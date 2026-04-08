import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { ProfileForm } from '@/app/(app)/profile/profile-form';

export default async function SettingsPage() {
  const session = await getSession();
  if (!session?.user?.id) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { artist: true },
  });

  if (!user?.artist) redirect('/become-artist');

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 font-[family-name:var(--font-display)] text-2xl font-bold text-foreground">
        Paramètres du profil
      </h1>
      <ProfileForm user={user} artist={user.artist} />
    </div>
  );
}
