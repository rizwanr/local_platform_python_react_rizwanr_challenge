import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  PropsWithChildren,
} from 'react';
import fetchClient from '../utils/fetchClient';
import {
  Instructor,
  Studio,
  StudioParams,
  InstructorParams,
  Workshop,
} from '../sharedTypes';
import { useUserContext } from './UserData';
import { useWorkshopData } from './WorkshopData';
import { countBy } from '../helpers';

interface TeamDataContextValue {
  instructors: Instructor[];
  studios: Studio[];
  isLoading: boolean;
  error: string | null;
  workshopCountByInstructor: Map<string, number>;
  workshopCountByStudio: Map<string, number>;
  createInstructor: (params: InstructorParams) => Promise<void>;
  createSampleInstructors: () => Promise<void>;
  createStudio: (params: StudioParams) => Promise<void>;
  createSampleStudios: () => Promise<void>;
  refreshData: () => Promise<void>;
  studioById: (id: Studio['id']) => Studio;
  instructorById: (id: Instructor['id']) => Instructor;
}

const TeamDataContext = createContext<TeamDataContextValue | null>(null);

export const TeamDataProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { user } = useUserContext(); // Get the logged-in user from UserContext
  const { workshops, isLoading: isWorkshopsLoading } = useWorkshopData();

  //These two collections are private state to facilitate finding by id and are not
  //exposed to the context
  const [instructorsById, setInstructorsById] = useState<
    Map<string, Instructor>
  >(new Map());
  const [studiosById, setStudiosById] = useState<Map<string, Studio>>(
    new Map()
  );
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [studios, setStudios] = useState<Studio[]>([]);
  const [workshopCountByInstructor, setWorkshopCountByInstructor] = useState<
    Map<string, number>
  >(new Map());
  const [workshopCountByStudio, setWorkshopCountByStudio] = useState<
    Map<string, number>
  >(new Map());

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (studiosById) setStudios(Array.from(studiosById.values()));
    if (instructorsById) setInstructors(Array.from(instructorsById.values()));
    if (workshops && workshops.length > 0) {
      setUpcomingWorkshopCounts();
    }
  }, [studiosById, instructorsById, workshops]);

  const fetchData = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const [studiosResponse, instructorsResponse] = await Promise.all([
        fetchClient.get<{ studios: Studio[] }>('/studios'),
        fetchClient.get<{ instructors: Instructor[] }>('/instructors'),
      ]);
      const newStudiosById = new Map<string, Studio>();
      studiosResponse.data.studios.forEach((studio) => {
        newStudiosById.set(studio.id, studio);
      });

      const newInstructorsById = new Map<string, Instructor>();
      instructorsResponse.data.instructors.forEach((instructor) => {
        newInstructorsById.set(instructor.id, instructor);
      });

      setStudiosById(newStudiosById);
      setInstructorsById(newInstructorsById);
    } catch (err: any) {
      console.error('Error fetching team data:', err);
      setError(err.message || 'Failed to fetch team data');
    } finally {
      setIsLoading(false);
    }
  };

  const createStudio = async (params: StudioParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchClient.post<{ studio: Studio }>(
        '/studios',
        params
      );
      const studio = response.data.studio;
      setStudiosById(new Map(studiosById).set(studio.id, studio));
    } catch (err: any) {
      console.error('Error creating studio:', err);
      setError(err.message || 'Failed to create studio');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const createSampleStudios = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchClient.post<{ studios: Studio[] }>(
        '/studios/quickstart'
      );
      const newStudiosById = new Map<string, Studio>();
      response.data.studios.forEach((studio) => {
        newStudiosById.set(studio.id, studio);
      });

      setStudiosById(newStudiosById);
    } catch (err: any) {
      console.error('Error creating sample studios:', err);
      setError(err.message || 'Failed to create sample studios');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new instructor
  const createInstructor = async (params: InstructorParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchClient.post<{ instructor: Instructor }>(
        '/instructors',
        params
      );
      const instructor = response.data.instructor;
      setInstructorsById(
        new Map(instructorsById).set(instructor.id, instructor)
      );
    } catch (err: any) {
      console.error('Error creating instructor:', err);
      setError(err.message || 'Failed to create instructor');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const createSampleInstructors = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchClient.post<{ instructors: Instructor[] }>(
        '/instructors/quickstart'
      );
      const { instructors } = response.data;
      const newInstructorsById = new Map<string, Instructor>();
      instructors.forEach((instructor) => {
        newInstructorsById.set(instructor.id, instructor);
      });

      setInstructorsById(newInstructorsById);
    } catch (err: any) {
      console.error('Error creating instructors:', err);
      setError(err.message || 'Failed to create instructors');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const studioById = (id: Studio['id']): Studio => {
    if (!studiosById || !studiosById.size) {
      throw new Error('Studios are not available');
    }
    const studio = studiosById.get(id);
    if (!studio) {
      throw new Error(`Studio with id ${id} not found`);
    }
    return studio;
  };

  const instructorById = (id: Instructor['id']): Instructor => {
    if (!instructorsById || !instructorsById.size) {
      throw new Error('Instructors are not available');
    }
    const instructor = instructorsById.get(id);

    if (!instructor) {
      throw new Error(`Instructor with id ${id} not found`);
    }
    return instructor;
  };

  const setUpcomingWorkshopCounts = () => {
    if (isWorkshopsLoading || !workshops) return;
    const workshopCountByStudio = countBy(
      workshops,
      (workshop: Workshop) => workshop.studioId
    );
    const workshopCountByInstructor = countBy(
      workshops,
      (workshop: Workshop) => workshop.instructorId
    );

    setWorkshopCountByInstructor(workshopCountByInstructor);
    setWorkshopCountByStudio(workshopCountByStudio);
  };

  const refreshData = async () => {
    await fetchData();
  };

  useEffect(() => {
    if (!user) return;
    fetchData();
  }, [user]);

  const value: TeamDataContextValue = {
    instructors,
    studios,
    isLoading,
    error,
    workshopCountByInstructor,
    workshopCountByStudio,
    createInstructor,
    createStudio,
    createSampleStudios,
    createSampleInstructors,
    refreshData,
    studioById,
    instructorById,
  };

  return (
    <TeamDataContext.Provider value={value}>
      {children}
    </TeamDataContext.Provider>
  );
};

export const useTeamData = (): TeamDataContextValue => {
  const context = useContext(TeamDataContext);
  if (!context) {
    throw new Error('useTeamData must be used within a TeamDataProvider');
  }
  return context;
};
