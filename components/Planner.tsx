import React, { useState } from 'react';
import type { PlannerOptions } from '../types';
import { useToast } from './ui/Toast';

interface PlannerProps {
  onPlanGenerated: (options: PlannerOptions) => void;
  isLoading: boolean;
}

const interestsOptions = ['History', 'Art & Culture', 'Food', 'Adventure', 'Nature', 'Shopping', 'Nightlife', 'Relaxation'];

const Planner: React.FC<PlannerProps> = ({ onPlanGenerated, isLoading }) => {
  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState(3);
  const [budget, setBudget] = useState<'Budget-Friendly' | 'Mid-Range' | 'Luxury'>('Mid-Range');
  const [interests, setInterests] = useState<string[]>([]);
  const { toast } = useToast();

  const handleInterestChange = (interest: string) => {
    setInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) {
        toast({ title: "Destination is required", variant: 'destructive' });
        return;
    }
    if (interests.length === 0) {
        toast({ title: "Select at least one interest", variant: 'destructive' });
        return;
    }
    onPlanGenerated({ destination, duration, budget, interests });
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 mb-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Plan Your Next Adventure</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="destination" className="block text-sm font-medium text-gray-700">Destination</label>
          <input
            id="destination"
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Paris, France"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration (days)</label>
            <input
              id="duration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value, 10))}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              min="1"
              max="30"
              required
            />
          </div>
          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700">Budget</label>
            <select
              id="budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value as any)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option>Budget-Friendly</option>
              <option>Mid-Range</option>
              <option>Luxury</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Interests</label>
          <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {interestsOptions.map(interest => (
              <label key={interest} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={interests.includes(interest)}
                  onChange={() => handleInterestChange(interest)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{interest}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
          >
            {isLoading ? 'Generating Your Itinerary...' : 'Create My Trip'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Planner;
