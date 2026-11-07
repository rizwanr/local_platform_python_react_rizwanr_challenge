'use client';

import React, { useState } from 'react';
import { UserPlus, Phone, Mail } from 'lucide-react';
import { Instructor } from '@/sharedTypes';
import { useTeamData } from '@/contexts/TeamData';
import { Button, Modal } from '@/components/ui';
import InstructorForm from '@/components/forms/InstructorForm';
import Container from '@/components/Container';
import EmptyResult from './EmptyResult';

interface InstructorsTableProps {
  instructors: Instructor[];
}

export function InstructorsTable({ instructors }: InstructorsTableProps) {
  const [formOpen, setFormOpen] = useState(false);
  const { isLoading, workshopCountByInstructor } = useTeamData();

  let instructorList = <EmptyResult resourceName="instructors" />;
  if (instructors.length > 0) {
    const instructorElts = instructors.map((instructor) => {
      return (
        <Container
          className="relative flex cursor-pointer flex-col items-center transition hover:shadow-lg"
          key={instructor.id}
        >
          <div className="flex flex-col items-center gap-4">
            <h3 className="text-lg font-medium">{instructor.name}</h3>
            <p className="text-sm text-subdued">
              Upcoming Workshops:{' '}
              {workshopCountByInstructor.get(instructor.id) || 0}
            </p>
            {instructor.profilePhoto && (
              <img
                src={instructor.profilePhoto}
                alt={`${instructor.name}'s profile`}
                className="h-16 w-16 rounded-full object-cover"
              />
            )}
            <div className="flex gap-5">
              <Phone color="var(--secondary)" />
              <Mail color="var(--secondary)" />
            </div>
          </div>
        </Container>
      );
    });
    instructorList = (
      <div className="mt-4 grid gap-4 sm:grid-cols-3 xl:grid-cols-4">
        {instructorElts}
      </div>
    );
  }

  return (
    <div className="pt-8">
      <div className="flex">
        <h1 className="flex-1 text-3xl font-bold">Instructors</h1>
        <Button
          variant="primaryCreate"
          onClick={() => setFormOpen(true)}
          disabled={isLoading}
        >
          <UserPlus className="h-5 w-5" />
          Add instructors
        </Button>
      </div>
      {instructorList}
      <Modal
        title="Create Instructor"
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
      >
        <InstructorForm setOpen={setFormOpen} />
      </Modal>
    </div>
  );
}

export default InstructorsTable;
