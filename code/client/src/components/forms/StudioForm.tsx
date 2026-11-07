import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CopyPlus } from 'lucide-react';
import { Field } from '../ui/Field';
import { Button } from '../ui/Button';
import { useTeamData } from '@/contexts/TeamData';
import { StudioParams, StudioParamsSchema } from '@/sharedTypes';

interface StudioFormProps {
  setOpen: (open: boolean) => void;
}

export function StudioForm({ setOpen }: StudioFormProps) {
  const { createStudio, createSampleStudios, isLoading } = useTeamData();
  const [error, setError] = useState<any | null>(null);

  const { control, handleSubmit, formState } = useForm<StudioParams>({
    resolver: zodResolver(StudioParamsSchema),
    defaultValues: {
      name: '',
      maxCapacity: 10,
    },
  });

  const onSubmit = async (data: StudioParams) => {
    try {
      await createStudio(data);
      setOpen(false);
    } catch (error: any) {
      setError(error.message || 'Failed to create studio');
      console.error('Error creating studio:', error);
    }
  };

  const handleCreateSampleStudios = async () => {
    try {
      await createSampleStudios();
      setOpen(false);
    } catch (error: any) {
      setError(error.message || 'Failed to create sample studios');
      console.error('Error creating studio:', error);
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
          label="Studio Name"
          placeholder="Red Lion"
        />
        <Field
          control={control}
          name="maxCapacity"
          label="Maximum Capacity"
          type="number"
        />
        <div className="flex items-center justify-between">
          <Button
            type="submit"
            disabled={
              isLoading ||
              formState.isSubmitting ||
              !formState.isDirty ||
              !formState.isValid
            }
            className="ml-2"
          >
            {formState.isSubmitting ? 'Creating...' : 'Create Studio'}
          </Button>
          <Button
            className="ml-2"
            variant="secondary"
            disabled={isLoading || formState.isSubmitting}
            onClick={handleCreateSampleStudios}
          >
            <CopyPlus className="h-5 w-5" />
            Quick samples
          </Button>
        </div>
      </form>
    </>
  );
}

export default StudioForm;
