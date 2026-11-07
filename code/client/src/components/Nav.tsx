'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home as HomeIcon,
  Wallet as WalletIcon,
  Coins as CoinsIcon,
  Users as UsersIcon,
  LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { useUserContext } from '@/contexts/UserData';

interface NavigationMenuItem {
  label: string;
  href: string;
  icon: LucideIcon;
  paths: string[];
  countryFilter?: string[];
}

const navigationMenuItems: NavigationMenuItem[] = [
  {
    label: 'Home',
    href: '/',
    icon: HomeIcon,
    paths: [],
  },
  {
    label: 'Team',
    href: '/team',
    icon: UsersIcon,
    paths: [],
  },
  {
    label: 'Payments',
    href: '/payments',
    icon: WalletIcon,
    paths: [],
  },
  {
    label: 'Payouts',
    href: '/payouts',
    icon: CoinsIcon,
    paths: [],
  },
];

const Nav = () => {
  const pathname = usePathname();
  const { user } = useUserContext();
  if (!user) throw new Error('User not found');
  const accountID = user.stripeAccount;

  const country = 'US';

  const displayIssuing = true;

  return (
    <div className="fixed z-40 h-screen w-64 bg-primary p-3">
      <Image
        className="p-5"
        src="/zenflow.png"
        alt="ZenFlow"
        width={150}
        height={50}
      />
      <nav>
        <ul className="flex-col items-start space-x-0">
          {navigationMenuItems
            .filter(
              (item) =>
                !item.countryFilter || item.countryFilter.includes(country)
            )
            .map((item) => (
              <li key={item.label} className="p-1">
                <Link href={`${item.href}`}>
                  <Button
                    className={`w-full justify-start text-lg text-white hover:bg-white ${
                      pathname === item.href || item.paths.includes(pathname)
                        ? 'bg-white bg-opacity-15 hover:bg-opacity-15'
                        : 'bg-none hover:bg-opacity-10'
                    }`}
                  >
                    <item.icon className="mr-2 h-5 w-5" color="white" />{' '}
                    {item.label}
                  </Button>
                </Link>
              </li>
            ))}
          <li>
            <Link href={`/account`}>
              <Button
                className={`fixed bottom-5 justify-start text-lg text-white hover:bg-white ${
                  pathname.startsWith('/account')
                    ? 'bg-white bg-opacity-15 hover:bg-opacity-15'
                    : 'bg-none hover:bg-opacity-10'
                }`}
              >
                <Avatar className="mr-2 h-5 w-5">
                  <AvatarImage src="/avatar.png" alt="profile" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>{' '}
                <span title={accountID}>{user.name}</span>
              </Button>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Nav;
