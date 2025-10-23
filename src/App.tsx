import React, { useState, useEffect } from 'react';
import { User } from '@/types';
import { getMe } from '@/services/apiService';
import AuthPage from '@/pages/AuthPage';
import DashboardPage from '@/pages/DashboardPage';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/providers/ThemeProvider';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getMe();
        setUser(currentUser);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    // apiService.logout() is synchronous and just removes from localStorage
    setUser(null);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      {user ? (
        <DashboardPage user={user} onLogout={handleLogout} />
      ) : (
        <AuthPage onLogin={handleLogin} />
      )}
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
