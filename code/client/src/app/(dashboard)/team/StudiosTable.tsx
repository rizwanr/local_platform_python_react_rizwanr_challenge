'use client';

import React, { useState } from 'react';
import { HousePlus } from 'lucide-react';
import { Studio } from '@/sharedTypes';
import { useTeamData } from '@/contexts/TeamData';
import { Button, Modal } from '@/components/ui';
import StudioForm from '@/components/forms/StudioForm';
import Container from '@/components/Container';
import EmptyResult from './EmptyResult';

interface StudiosTableProps {
  studios: Studio[];
}

export function StudiosTable({ studios }: StudiosTableProps) {
  const [formOpen, setFormOpen] = useState(false);
  const { isLoading, workshopCountByStudio } = useTeamData();
  let studioList = <EmptyResult resourceName="studios" />;
  if (studios.length > 0) {
    const studioElts = studios.map((studio) => {
      return (
        <Container
          className="relative flex cursor-pointer flex-col items-center gap-4 transition hover:shadow-lg"
          key={studio.id}
        >
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-medium">{studio.name}</h3>
            <p className="text-sm text-subdued">
              Upcoming Workshops: {workshopCountByStudio.get(studio.id) || 0}
            </p>
            <p className="text-sm text-subdued">
              Max Capacity: {studio.maxCapacity}
            </p>
          </div>
        </Container>
      );
    });
    studioList = (
      <div className="mt-4 grid gap-4 sm:grid-cols-3 xl:grid-cols-4">
        {studioElts}
      </div>
    );
  }
  return (
    <>
      <div className="flex">
        <h1 className="flex-1 text-3xl font-bold">Studios</h1>
        <Button
          variant="primaryCreate"
          onClick={() => setFormOpen(true)}
          disabled={isLoading}
        >
          <HousePlus className="h-5 w-5" />
          Add studios
        </Button>
      </div>
      {studioList}
      <Modal
        title="Create Studio"
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
      >
        <StudioForm setOpen={setFormOpen} />
      </Modal>
    </>
  );
}

export default StudiosTable;
