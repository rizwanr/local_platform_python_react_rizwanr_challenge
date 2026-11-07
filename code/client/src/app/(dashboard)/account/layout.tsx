'use client';

import SubNav from '@/components/SubNav';
import { Button } from '@/components/ui/Button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { useUserContext } from '@/contexts/UserData';
export default function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { logout } = useUserContext();

  return (
    <>
      <header className="flex flex-row justify-between">
        <div className="flex flex-row">
          <Avatar className="mr-5 h-10 w-10">
            <AvatarImage src="/avatar.png" alt="profile" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>{' '}
          <h1 className="text-3xl font-bold">My studio</h1>
        </div>
        <div className="flex flex-row justify-between">
          <SubNav
            base={`/account`}
            routes={[
              {
                path: `/account`,
                label: 'Account',
              },
              {
                path: `/account/payment_methods`,
                label: 'Payment methods',
              },
            ]}
          />
          <div>
            <Button
              className="text-md ml-2 self-end p-2 hover:bg-white/80"
              variant="ghost"
              onClick={logout}
            >
              Sign out
            </Button>
          </div>
        </div>
      </header>
      {children}
    </>
  );
}
