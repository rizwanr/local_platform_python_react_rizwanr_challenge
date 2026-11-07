'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Container from '@/components/Container';
import { ArrowRight } from 'lucide-react';
import { useUserContext } from '@/contexts/UserData';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const { clearError } = useUserContext();

  useEffect(() => {
    clearError();
  }, [pathname]);

  let header = 'Manage your studio with ease.';
  let subheader = "ZenFlow is the world's leading health and wellness platform.";

  if (pathname.includes('onboarding')) {
    header = 'Sign up';
    subheader = 'Fill out the form to set up your account.';
  }

  return (
    <div className="relative">
      <div className="flex min-h-screen min-w-[926px] justify-center space-x-20 px-6 py-[120px]">
        <div className="flex w-[900px]">
          <div className="fixed min-h-full max-w-sm space-y-4">
            <img
              className="mb-4 inline-block"
              src="/zenflow.png"
              alt="ZenFlow"
              width={150}
              height={50}
            />
            <h1 className="text-4xl font-bold">{header}</h1>
            <p className="text-xl text-subdued">{subheader}</p>
            <Link
              href="mailto:support@zenflow.dev"
              className="flex flex-row items-center gap-x-1"
            >
              <div className="font-bold text-primary">Contact support</div>
              <ArrowRight color="#221b35" size={18} className="mt-[1px]" />
            </Link>
          </div>
          <div className="ml-auto min-w-[30rem]">
            <Container className="no-scrollbar overflow-scroll rounded-[16px] px-5 py-5">
              {children}
            </Container>
          </div>
        </div>
      </div>
      <img
        src="/background.jpg"
        alt="logo"
        sizes="100vw"
        className="fixed inset-0 z-[-1] h-full w-full min-w-[926px] overflow-hidden object-cover"
      />
    </div>
  );
}
