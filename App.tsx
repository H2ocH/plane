import React, { useState, useEffect } from 'react';
import { getMe, logout } from './services/apiService';
import type { User } from './types';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import { ToastProvider } from './components/ui/Toast';
import OfflineBanner from './components/OfflineBanner';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getMe();
        setUser(currentUser);
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkUser();
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <ToastProvider>
      <div className="flex flex-col min-h-screen bg-gray-50 font-sans text-gray-800">
        <OfflineBanner />
        <Header user={user} onLogout={handleLogout} />
        <main className="flex-grow container mx-auto px-4 py-8">
          {user ? <Dashboard /> : <Login onLogin={handleLogin} />}
        </main>
        <Footer />
      </div>
    </ToastProvider>
  );
}

export default App;
