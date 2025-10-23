import React from 'react';
import type { User } from '../types';
import { PlaneIcon } from './IconComponents';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <PlaneIcon className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">AI Trip Planner</h1>
        </div>
        {user && (
          <div className="flex items-center gap-4">
            <span className="text-gray-600 hidden sm:inline">Welcome, {user.name}</span>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
