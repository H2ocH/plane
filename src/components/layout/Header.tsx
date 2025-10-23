import React from 'react';
import { PlaneIcon } from '@/components/IconComponents';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { logout } from '@/services/apiService';

interface HeaderProps {
  username?: string;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ username, onLogout }) => {
  const handleLogout = () => {
    logout();
    if (onLogout) {
      onLogout();
    }
  }

  return (
    <header className="py-4 px-6 border-b bg-background sticky top-0 z-40">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <PlaneIcon className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">AI Trip Planner</h1>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {username && (
            <>
              <span className="text-sm hidden sm:inline">Welcome, {username}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
