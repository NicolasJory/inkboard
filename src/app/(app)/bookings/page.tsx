import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { OrnamentDivider } from '@/components/icons';
import { BookingActions } from './booking-actions';

export default async function BookingsPage() {
  const session = await getSession();
  if (!session?.user?.id) redirect('/login');

  const artist = await prisma.artist.findUnique({
    where: { userId: session.user.id },
  });

  if (!artist) redirect('/dashboard');

  const bookings = await prisma.booking.findMany({
    where: { artistId: artist.id },
    include: {
      user: { select: { name: true, email: true } },
    },
    orderBy: { date: 'asc' },
  });

  const pending = bookings.filter((b) => b.status === 'PENDING');
  const upcoming = bookings.filter((b) => b.status === 'CONFIRMED' && b.date >= new Date());
  const past = bookings.filter(
    (b) =>
      b.status === 'COMPLETED' ||
      b.status === 'CANCELLED' ||
      (b.status === 'CONFIRMED' && b.date < new Date()),
  );

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-2 font-[family-name:var(--font-display)] text-3xl font-bold text-foreground">
        Rendez-vous
      </h1>
      <p className="mb-8 text-muted">Gérez vos demandes et vos rendez-vous.</p>

      {/* Pending */}
      {pending.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 font-[family-name:var(--font-display)] text-xl font-semibold text-accent">
            En attente ({pending.length})
          </h2>
          <div className="space-y-3">
            {pending.map((booking) => (
              <div key={booking.id} className="rounded-xl border border-accent/30 bg-accent/5 p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-foreground">
                      {booking.user.name ?? booking.user.email}
                    </p>
                    <p className="mt-0.5 text-sm text-muted">
                      {booking.date.toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    {booking.description && (
                      <p className="mt-2 text-sm text-foreground/80">{booking.description}</p>
                    )}
                  </div>
                  <BookingActions bookingId={booking.id} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <OrnamentDivider className="mx-auto mb-8 w-48 text-accent/15" />

      {/* Upcoming */}
      <section className="mb-8">
        <h2 className="mb-4 font-[family-name:var(--font-display)] text-xl font-semibold text-foreground">
          A venir ({upcoming.length})
        </h2>
        {upcoming.length === 0 ? (
          <p className="text-sm text-muted">Aucun rendez-vous confirmé à venir.</p>
        ) : (
          <div className="space-y-3">
            {upcoming.map((booking) => (
              <div key={booking.id} className="rounded-xl border border-card-border bg-card p-5">
                <p className="font-semibold text-foreground">
                  {booking.user.name ?? booking.user.email}
                </p>
                <p className="mt-0.5 text-sm text-muted">
                  {booking.date.toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                {booking.description && (
                  <p className="mt-2 text-sm text-foreground/80">{booking.description}</p>
                )}
                <span className="mt-2 inline-block rounded-full bg-success/10 px-3 py-0.5 text-xs font-medium text-success">
                  Confirmé
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Past */}
      {past.length > 0 && (
        <section>
          <h2 className="mb-4 font-[family-name:var(--font-display)] text-xl font-semibold text-muted">
            Historique ({past.length})
          </h2>
          <div className="space-y-3">
            {past.map((booking) => (
              <div
                key={booking.id}
                className="rounded-xl border border-card-border bg-card/50 p-5 opacity-60"
              >
                <p className="font-semibold text-foreground">
                  {booking.user.name ?? booking.user.email}
                </p>
                <p className="mt-0.5 text-sm text-muted">
                  {booking.date.toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <span
                  className={`mt-2 inline-block rounded-full px-3 py-0.5 text-xs font-medium ${
                    booking.status === 'CANCELLED'
                      ? 'bg-error/10 text-error'
                      : 'bg-muted/10 text-muted'
                  }`}
                >
                  {booking.status === 'CANCELLED' ? 'Annulé' : 'Terminé'}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
