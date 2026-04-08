import { SessionProvider } from '@/components/session-provider';
import { UserNav } from '@/components/user-nav';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="flex min-h-screen flex-col">
        <UserNav />
        <main className="flex-1 px-6 py-8 md:px-12">{children}</main>
      </div>
    </SessionProvider>
  );
}
