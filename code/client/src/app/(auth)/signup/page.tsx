'use client';

import React from 'react';
import { ArrowRight, Loader2 as Loader } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import Link from 'next/link';
import { useUserContext } from '@/contexts/UserData';
import LoaderPage from '@/components/ui/LoaderPage';
import { UserParams, UserParamsSchema } from '@/sharedTypes';

export default function SignupForm() {
  const { register, isLoading, error: userError } = useUserContext();
  const { control, formState, handleSubmit } = useForm<UserParams>({
    resolver: zodResolver(UserParamsSchema),
    defaultValues: {
      email: '',
      name: '',
    },
  });

  const onSubmit = async (values: UserParams) => {
    await register(values);
  };

  if (isLoading) return <LoaderPage />;

  return (
    <div className="max-w-lg">
      <div>
        <h2 className="text-2xl font-bold">Sign up</h2>
        <div>
          Already have an account?{' '}
          <Link href={`/login`} className="font-bold text-primary underline">
            Login <ArrowRight className="mb-0.5 inline w-4" strokeWidth={2.5} />
          </Link>
        </div>
      </div>
      {userError && <span className="text-red-500">{userError}</span>}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-3 flex flex-col space-y-2 space-y-4"
      >
        <Field
          name="email"
          control={control}
          label="Email"
          placeholder="sample@email.com"
        />
        <Field
          name="name"
          control={control}
          label="Name"
          placeholder="Jenny Rosen"
        />
        <Button
          type="submit"
          disabled={formState.isSubmitting}
          className={'w-full rounded-md bg-primary p-2 font-bold text-white'}
        >
          {!formState.isSubmitting && <>Continue</>}
          {formState.isSubmitting && (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" /> Loading
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
