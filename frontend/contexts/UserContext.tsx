import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserPreferences, defaultUserPreferences } from '@/types/user';

interface UserContextType {
  user: User | null;
  preferences: UserPreferences;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const STORAGE_KEY_USER = 'dataspeak-user';
const STORAGE_KEY_PREFERENCES = 'dataspeak-preferences';

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const [preferences, setPreferences] = useState<UserPreferences>(
    defaultUserPreferences
  );

  const isAuthenticated = user !== null;

  // Hydrate user and preferences from localStorage on the client only
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const storedUser = localStorage.getItem(STORAGE_KEY_USER);
      if (storedUser) setUser(JSON.parse(storedUser));
    } catch (e) {
      // ignore parse errors or unavailable storage
    }

    try {
      const storedPrefs = localStorage.getItem(STORAGE_KEY_PREFERENCES);
      if (storedPrefs) setPreferences(JSON.parse(storedPrefs));
    } catch (e) {
      // ignore parse errors or unavailable storage
    }
  }, []);

  // Sauvegarder l'utilisateur (client-only)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY_USER);
      }
    } catch (e) {
      // ignore write/remove errors (e.g., storage disabled)
    }
  }, [user]);

  // Sauvegarder les préférences (client-only)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(
        STORAGE_KEY_PREFERENCES,
        JSON.stringify(preferences)
      );
    } catch (e) {
      // ignore write errors
    }
  }, [preferences]);

  const login = async (email: string, password: string) => {
    // TODO: Remplacer par un vrai appel API
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock user
    const mockUser: User = {
      id: '1',
      email,
      firstName: 'John',
      lastName: 'Doe',
      avatar: undefined,
      jobTitle: 'Data Analyst',
      company: 'DataCorp',
      createdAt: new Date('2024-01-15'),
      lastLogin: new Date(),
    };

    setUser(mockUser);
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY_USER);
      } catch (e) {
        // ignore
      }
    }
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferences(prev => ({ ...prev, ...updates }));
  };

  return (
    <UserContext.Provider
      value={{
        user,
        preferences,
        isAuthenticated,
        login,
        logout,
        updateUser,
        updatePreferences,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
