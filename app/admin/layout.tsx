'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AuthProvider, useAuth } from '@/lib/auth/auth-context';

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      // Wenn nicht eingeloggt und nicht auf der Login-Seite, zu Login umleiten
      if (!user && pathname !== '/admin/login') {
        router.push('/admin/login');
      }
      // Wenn eingeloggt und auf der Login-Seite, zum Dashboard umleiten
      if (user && pathname === '/admin/login') {
        router.push('/admin');
      }
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Lade...</div>
      </div>
    );
  }

  // Login-Seite immer anzeigen
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Alle anderen Admin-Seiten nur für authentifizierte Benutzer
  if (!user) {
    return null; // Umleitung passiert in useEffect
  }

  return <>{children}</>;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AuthProvider>
  );
}
