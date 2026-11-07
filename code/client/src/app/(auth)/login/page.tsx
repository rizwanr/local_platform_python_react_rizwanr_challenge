'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2 as Loader } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import Link from 'next/link';
import { useUserContext } from '@/contexts/UserData';
import LoaderPage from '@/components/ui/LoaderPage';
import { UserLogin, LoginSchema } from '@/sharedTypes';

export default function Login() {
  const router = useRouter();
  const { login, isLoading, error: userError } = useUserContext();
  const { control, handleSubmit, formState } = useForm<UserLogin>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: UserLogin) => {
    await login(values.email);

    if (!userError && !isLoading) {
      router.push(`/`);
    }
  };

  if (isLoading) return <LoaderPage />;

  return (
    <div className="max-w-lg">
      <div>
        <h2 className="text-2xl font-bold">Login</h2>
        <div>
          Don&apos;t have an account?{' '}
          <Link href={`/signup`} className="font-bold text-primary underline">
            Sign up{' '}
            <ArrowRight className="mb-0.5 inline w-4" strokeWidth={2.5} />
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
          placeholder="jennyrosen@sample.com"
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
