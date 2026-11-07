'use client';

import React from 'react';
import Link from 'next/link';
import Container from './Container';
import { ChevronRight } from 'lucide-react';

const BalanceWidget = () => {
  // Localization for currency
  const sign = '$';

  return (
    <Container className="px-5">
      <div className="flex flex-row justify-between space-y-1">
        <div>
          <h1 className="font-bold text-subdued">Total Balance</h1>
          {/*TODO: balance will not be stored in the database*/}
          {/* <div className="text-xl font-bold">
            {sign}
            {((session?.user.availableBalance || 0) / 100).toFixed(2)}{' '}
          </div>
          <div className="text-md font-subdued">
            {sign}
            {((session?.user.pendingBalance || 0) / 100).toFixed(2)}{' '}
            {t('components.balance.pending')}
          </div> */}
        </div>
        <div>
          <Link href={`/payouts`} className="flex flex-row items-center">
            <div className="text-sm font-bold text-primary">Payout</div>
            <ChevronRight color="#221b35" size={18} className="mt-[1px]" />
          </Link>
        </div>
      </div>
    </Container>
  );
};

export default BalanceWidget;
