import React, { useState, useEffect, createContext, useContext } from 'react';
import AuthPage from '@/pages/AuthPage';
import DashboardPage from '@/pages/DashboardPage';
import LoadingSpinner from '@/components/LoadingSpinner';
import { User } from '@/types';
import * as api from '@/services/apiService';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import OfflineBanner from '@/components/layout/OfflineBanner';

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await api.getMe();
        setUser(currentUser);
      } catch (error) {
        // Not logged in, user remains null
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="trip-planner-theme">
      <AuthContext.Provider value={{ user, login: handleLogin, logout: handleLogout }}>
        <OfflineBanner />
        {user ? <DashboardPage /> : <AuthPage onLogin={handleLogin} />}
        <Toaster />
      </AuthContext.Provider>
    </ThemeProvider>
  );
};

export default App;
