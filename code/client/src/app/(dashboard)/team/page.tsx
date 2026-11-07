'use client';

import { useTeamData } from '@/contexts/TeamData';

import StudiosTable from './StudiosTable';
import InstructorsTable from './InstructorsTable';

export default function Team() {
    const { instructors, studios } = useTeamData();

    return (
        <>
            <StudiosTable {...{ studios }} />
            <InstructorsTable {...{ instructors }} />
        </>
    );
}

