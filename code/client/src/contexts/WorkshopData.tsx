'use client';

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  PropsWithChildren,
} from 'react';
import fetchClient from '../utils/fetchClient';

import { WorkshopForm, Workshop } from '@/sharedTypes';
import { useUserContext } from './UserData';

interface WorkshopDataContextValue {
  workshops: Workshop[];
  isLoading: boolean;
  error: string | null;
  createWorkshop: (params: WorkshopForm) => Promise<void>;
  createSampleWorkshops: () => Promise<void>;
  refreshData: () => Promise<void>;
}

const WorkshopDataContext = createContext<WorkshopDataContextValue | null>(
  null
);

export const WorkshopDataProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { user } = useUserContext(); // Get the logged-in user from UserContext
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!user) return;

    setError(null);
    setIsLoading(true);
    try {
      const workshops = await fetchClient.get('/workshops');
      setWorkshops(workshops.data.workshops);
    } catch (error: any) {
      console.error('Error fetching workshops:', error);
      setError(error.message || 'Failed to fetch workshops. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const createWorkshop = async (params: WorkshopForm) => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchClient.post('/workshops', params);
      setWorkshops([...workshops, response.data.workshop]);
    } catch (error: any) {
      console.error(error);
      setError(error.message || 'Failed to create workshop. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const createSampleWorkshops = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchClient.post('/workshops/quickstart');
      const { workshops } = response.data;

      setWorkshops(workshops);
    } catch (err: any) {
      console.error('Error creating instructor:', err);
      setError(err.message || 'Failed to seed workshops. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    await fetchData();
  };

  useEffect(() => {
    if (!user) return;
    fetchData();
  }, [user]);

  const value: WorkshopDataContextValue = {
    isLoading,
    error,
    workshops,
    createWorkshop,
    createSampleWorkshops,
    refreshData,
  };

  return (
    <WorkshopDataContext.Provider value={value}>
      {children}
    </WorkshopDataContext.Provider>
  );
};

export const useWorkshopData = (): WorkshopDataContextValue => {
  const context = useContext(WorkshopDataContext);
  if (!context) {
    throw new Error(
      'useWorkshopData must be used within a WorkshopDataProvider'
    );
  }
  return context;
};
