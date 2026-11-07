/**
 * Milestone 2: Render the ConnectPayments embedded component in the container below.
 */
'use client';
import Container from '@/components/Container';
import MonthToDateWidget from '@/components/MonthToDateWidget';
import CustomersWidget from '@/components/CustomersWidget';

export default function Payments() {
  return (
    <>
      <h1 className="text-3xl font-bold">Payments</h1>
      <div className="flex flex-col gap-5 lg:flex-row">
        <div className="flex-1">
          <MonthToDateWidget />
        </div>
        <div className="flex-1">
          <CustomersWidget />
        </div>
      </div>
      <Container>
        <h1 className="ml-2 text-xl font-bold">Recent payments</h1>
        { /* TODO: Integrate Stripe */}
      </Container>
    </>
  );
}
