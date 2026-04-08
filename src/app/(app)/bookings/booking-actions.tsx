'use client';

import { useRouter } from 'next/navigation';
import { updateBookingStatus } from './actions';

export function BookingActions({ bookingId }: { bookingId: string }) {
  const router = useRouter();

  async function handleAction(status: 'CONFIRMED' | 'CANCELLED') {
    await updateBookingStatus(bookingId, status);
    router.refresh();
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleAction('CONFIRMED')}
        className="rounded-lg bg-success px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-success/80"
      >
        Accepter
      </button>
      <button
        onClick={() => handleAction('CANCELLED')}
        className="rounded-lg border border-error/30 px-3 py-1.5 text-xs font-semibold text-error transition-colors hover:bg-error/10"
      >
        Refuser
      </button>
    </div>
  );
}
