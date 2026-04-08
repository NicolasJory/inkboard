import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { OrnamentDivider } from '@/components/icons';
import { ProfileForm } from './profile-form';
import { PortfolioSection } from './portfolio-section';

export default async function ProfilePage() {
  const session = await getSession();
  if (!session?.user?.id) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      artist: {
        include: {
          portfolio: { orderBy: { createdAt: 'desc' } },
        },
      },
    },
  });

  if (!user?.artist) redirect('/become-artist');

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-2 font-[family-name:var(--font-display)] text-3xl font-bold text-foreground">
        Mon profil
      </h1>
      <p className="mb-8 text-muted">Gérez vos informations et votre portfolio.</p>

      <ProfileForm user={user} artist={user.artist} />

      <OrnamentDivider className="mx-auto my-10 w-48 text-accent/15" />

      <PortfolioSection artworks={user.artist.portfolio} />
    </div>
  );
}
