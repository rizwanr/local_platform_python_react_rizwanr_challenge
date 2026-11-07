import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CopyPlus } from 'lucide-react';
import { Field } from '../ui/Field';
import { Button } from '../ui/Button';
import { useTeamData } from '@/contexts/TeamData';
import { InstructorParams, InstructorParamsSchema } from '@/sharedTypes';
import { PROFILE_PHOTO_PLACEHOLDER } from '@/constants';

interface InstructorFormProps {
  setOpen: (open: boolean) => void;
}

export function InstructorForm({ setOpen }: InstructorFormProps) {
  const { createInstructor, createSampleInstructors, isLoading } =
    useTeamData();
  const [error, setError] = useState<any | null>(null);

  const { control, handleSubmit, formState } = useForm<InstructorParams>({
    resolver: zodResolver(InstructorParamsSchema),
    defaultValues: {
      name: '',
      profilePhoto: PROFILE_PHOTO_PLACEHOLDER,
    },
  });

  const onSubmit = async (data: InstructorParams) => {
    try {
      await createInstructor(data);
      setOpen(false);
    } catch (error: any) {
      setError(error.message || 'Failed to create instructor');
      console.error('Error creating instructor:', error);
    }
  };

  const handleCreateSampleInstructors = async () => {
    try {
      await createSampleInstructors();
      setOpen(false);
    } catch (error: any) {
      setError(error.message || 'Failed to create sample instructors');
      console.error('Error creating instructor:', error);
    }
  };

  return (
    <>
      {error && (
        <div className="mb-3 flex justify-center rounded-md bg-red-100 p-2 text-red-500">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field
          control={control}
          name="name"
          label="Name"
          placeholder="Jenny Rosen"
        />
        <Field
          control={control}
          name="profilePhoto"
          label="Profile Photo URL"
          placeholder={PROFILE_PHOTO_PLACEHOLDER}
          type="url"
          description="Optional: A URL to the instructor's profile photo."
        />
        <div className="flex items-center justify-between">
          <Button
            type="submit"
            disabled={
              formState.isSubmitting || !formState.isDirty || !formState.isValid
            }
            className="ml-4"
          >
            {formState.isSubmitting ? 'Creating...' : 'Create Instructor'}
          </Button>
          <Button
            variant="secondary"
            disabled={isLoading}
            className="ml-4"
            onClick={handleCreateSampleInstructors}
          >
            <CopyPlus className="h-5 w-5" />
            Quick samples
          </Button>
        </div>
      </form>
    </>
  );
}

export default InstructorForm;
