'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUserContext } from '@/contexts/UserData';
import LoaderPage from './ui/LoaderPage';
import { PUBLIC_ROUTES } from '@/constants';

export function AuthRedirect({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedIn, isLoading } = useUserContext();

  const isPrivateRoute = !PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  useEffect(() => {
    if (isLoading) return;
    if (!isLoggedIn && isPrivateRoute) {
      router.push('/login');
    }
  }, [pathname, isLoggedIn, isLoading, router, isPrivateRoute]);

  if (isLoading || (!isLoggedIn && isPrivateRoute)) {
    return <LoaderPage />;
  }

  return children;
}
