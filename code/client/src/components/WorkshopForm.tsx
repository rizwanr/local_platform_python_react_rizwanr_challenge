'use client';

import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui';
import { Field } from './ui/Field';

import { formatCurrency, getDurationOptions, timeOptions } from '@/helpers';
import { WorkshopForm as FormParams, WorkshopFormSchema } from '@/sharedTypes';
import { useTeamData } from '@/contexts/TeamData';
import { useWorkshopData } from '@/contexts/WorkshopData';

interface WorkshopFormProps {
  setOpen: (open: boolean) => void;
}

export function WorkshopForm({ setOpen }: WorkshopFormProps) {
  const [error, setError] = useState<any | null>(null);
  const { instructors, studios } = useTeamData();
  const { createWorkshop } = useWorkshopData();
  const { control, handleSubmit, formState, watch } = useForm<FormParams>({
    resolver: zodResolver(WorkshopFormSchema),
    defaultValues: {
      name: '',
      instructorId: '',
      studioId: '',
      capacity: 10,
      date: new Date().toISOString().split('T')[0],
      startTime: '9:00',
      duration: 15,
      amount: 0,
    },
  });
  const startTime = watch('startTime');
  const durationOptions = getDurationOptions(startTime);

  const onSubmit = async (values: FormParams) => {
    try {
      await createWorkshop(values);
      setOpen(false);
    } catch (error: any) {
      setError(error.message || 'Failed to create workshop. Please try again.');
      console.error(error);
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
          placeholder="Yoga Workshop"
        />
        <Field
          control={control}
          name="instructorId"
          label="Instructor"
          as="select"
          options={instructors.map((instructor) => ({
            value: instructor.id,
            label: instructor.name,
          }))}
        />
        <Field
          control={control}
          name="studioId"
          label="Studio"
          as="select"
          options={studios.map((studio) => ({
            value: studio.id,
            label: studio.name,
          }))}
        />
        <Field
          type="number"
          control={control}
          name="amount"
          label="Amount"
          placeholder={formatCurrency(0)}
        />
        <Field
          type="date"
          control={control}
          name="date"
          label="Date"
          placeholder="2021-01-01"
        />
        <Field
          control={control}
          name="startTime"
          label="Start Time"
          placeholder="Select a time"
          as="select"
          options={timeOptions}
        />
        <Field
          control={control}
          name="duration"
          label="Duration"
          placeholder="15"
          as="select"
          options={durationOptions}
        />
        <Button
          type="submit"
          disabled={
            formState.isSubmitting || !formState.isDirty || !formState.isValid
          }
          className="w-full"
        >
          {formState.isSubmitting ? 'Creating...' : 'Create Workshop'}
        </Button>
      </form>
    </>
  );
}
export default WorkshopForm;
