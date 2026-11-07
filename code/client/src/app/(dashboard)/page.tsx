'use client';

import { Banner } from '@/components/Banner';
import { useRouter } from 'next/navigation';
import Schedule from '@/components/Schedule';
import BalanceWidget from '@/components/BalanceWidget';
import MonthToDateWidget from '@/components/MonthToDateWidget';
import CustomersWidget from '@/components/CustomersWidget';
import { useUserContext } from '@/contexts/UserData';

export default function Dashboard() {
  const { user, detailsSubmitted, isDisabled, isChargesEnabled } =
    useUserContext();
  const router = useRouter();
  if (!user) throw new Error('User not found');

  return (
    <>
      <h1 className="text-3xl font-bold">Welcome {user.name}</h1>
      {/* Hidden data attribute for E2E testing */}
      <div data-stripe-account-id={user.stripeAccount} style={{ display: 'none' }} />
      <div className="flex flex-row items-start space-x-5">
        <div className="min-w-[700px] flex-1">
          {(!detailsSubmitted || isDisabled) && (
            <Banner
              message={
                !detailsSubmitted
                  ? 'Please go to the Account page and complete onboarding to begin creating workshops.'
                  : 'We need additional information before you can start processing payments.'
              }
              actionLabel="Go to account page"
              onAction={() => router.push('/account')}
              variant="warning"
            />
          )}
          {isChargesEnabled && <Schedule />}
        </div>
        <div className="w-[30%] min-w-[300px] space-y-4">
          <BalanceWidget />
          <h2 className="pt-4 text-lg font-bold">Performance</h2>
          <MonthToDateWidget />
          <CustomersWidget />
        </div>
      </div>
    </>
  );
}
