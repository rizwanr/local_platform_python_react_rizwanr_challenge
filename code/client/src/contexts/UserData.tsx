'use client';

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  PropsWithChildren,
} from 'react';
import fetchClient from '../utils/fetchClient';
import { User, UserParams } from '@/sharedTypes';
import { useRouter } from 'next/navigation';
interface State {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

interface UserContextType extends State {
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (values: UserParams) => Promise<void>;
  clearError: () => void;
  isLoggedIn: boolean;
  isDisabled: boolean;
  isChargesEnabled: boolean;
  detailsSubmitted: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: PropsWithChildren<unknown>) {
  const router = useRouter();
  const [state, setState] = useState<State>({
    user: null,
    isLoading: true,
    error: null,
  });

  function updateState(newState: Partial<State>) {
    setState((prevState) => {
      return { ...prevState, ...newState };
    });
  }

  function getErrorMessage(err: any): string {
    return err.message || 'An unknown error occurred';
  }

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const response = await fetchClient.get('/users');
        return updateState({ user: response.data || null, isLoading: false });
      } catch (error) {
        return updateState({ isLoading: false });
      }
    };

    checkUserSession();
  }, []);

  async function login(email: string) {
    try {
      updateState({ isLoading: true, error: null });
      const response = await fetchClient.post('/users/login', { email });
      updateState({ user: response.data });
    } catch (err: any) {
      updateState({
        error: getErrorMessage(err),
      });
    } finally {
      return updateState({ isLoading: false });
    }
  }

  async function logout() {
    try {
      updateState({ isLoading: true, error: null });
      await fetchClient.post('/users/logout');
      updateState({ user: null });
    } catch (err: any) {
      updateState({
        error: getErrorMessage(err),
      });
    } finally {
      return updateState({ isLoading: false });
    }
  }

  function clearError() {
    updateState({ error: null });
  }

  async function register(values: UserParams) {
    try {
      updateState({ isLoading: true, error: null });
      const response = await fetchClient.post('/users', {
        values,
      });
      updateState({ user: response.data });
      router.push('/');
    } catch (err: any) {
      updateState({
        error: getErrorMessage(err),
      });
    } finally {
      return updateState({ isLoading: false });
    }
  }

  const isLoggedIn = typeof state.user?.email === 'string';
  const isDisabled = typeof state.user?.disabledReason === 'string';
  const detailsSubmitted = state.user?.detailsSubmitted === true;
  const isChargesEnabled = state.user?.chargesEnabled === true;

  const contextValue = {
    ...state,
    login,
    logout,
    register,
    clearError,
    isLoggedIn,
    isDisabled,
    isChargesEnabled,
    detailsSubmitted,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

export function useUserContext(): UserContextType {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }

  return context;
}
