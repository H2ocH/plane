import React, { useState, useEffect, useCallback } from 'react';
import { User, Trip, PlannerOptions } from '@/types';
import { getTrips, createTrip, deleteTrip } from '@/services/apiService';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Planner from '@/features/planner/Planner';
import Itinerary from '@/features/planner/Itinerary';
import SkeletonLoader from '@/features/planner/SkeletonLoader';
import OfflineBanner from '@/components/layout/OfflineBanner';
import { useToast } from "@/components/ui/use-toast";
import { TrashIcon } from '@/components/IconComponents';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import ErrorState from '@/features/planner/ErrorState';

interface DashboardPageProps {
  user: User;
  onLogout: () => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ user, onLogout }) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [isLoadingTrips, setIsLoadingTrips] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadTrips = useCallback(async () => {
    setIsLoadingTrips(true);
    try {
      const fetchedTrips = await getTrips();
      setTrips(fetchedTrips);
      if (fetchedTrips.length > 0 && !selectedTrip) {
        setSelectedTrip(fetchedTrips[0]);
      } else if(fetchedTrips.length === 0) {
        setSelectedTrip(null);
      }
    } catch (error) {
      console.error("Failed to load trips:", error);
      toast({ variant: "destructive", title: "Failed to load trips." });
    } finally {
      setIsLoadingTrips(false);
    }
  }, [toast, selectedTrip]);

  useEffect(() => {
    loadTrips();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePlanGenerated = async (options: PlannerOptions) => {
    setIsGenerating(true);
    setError(null);
    try {
      const newTrip = await createTrip(options);
      const updatedTrips = [newTrip, ...trips];
      setTrips(updatedTrips);
      setSelectedTrip(newTrip);
      toast({ title: "Success!", description: "Your new trip has been generated." });
    } catch (err) {
       const errorMessage = (err as Error).message || "Failed to generate trip plan.";
       setError(errorMessage);
       toast({
        variant: "destructive",
        title: "Oh no! Something went wrong.",
        description: errorMessage,
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleDeleteTrip = async (tripId: string) => {
    const originalTrips = [...trips];
    const newTrips = trips.filter(t => t.id !== tripId);
    setTrips(newTrips);

    if (selectedTrip?.id === tripId) {
      setSelectedTrip(newTrips[0] || null);
    }

    try {
      await deleteTrip(tripId);
      toast({ title: "Trip deleted successfully." });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Deletion failed",
        description: "Could not delete trip. Restoring...",
      });
      setTrips(originalTrips);
    }
  };

  const sideBar = (
    <aside className="col-span-12 md:col-span-4 lg:col-span-3 xl:col-span-2 space-y-4">
      <h2 className="text-xl font-semibold mb-4 px-2">My Trips</h2>
      {isLoadingTrips ? (
        <div className="space-y-2 pr-2">
            {[...Array(3)].map((_, i) => <div key={i} className="h-10 bg-muted rounded-md animate-pulse" />)}
        </div>
      ) : trips.length > 0 ? (
        <ul className="space-y-2">
          {trips.map(trip => (
            <li key={trip.id}>
              <button
                  className={`w-full text-left p-2 rounded-md flex justify-between items-center ${selectedTrip?.id === trip.id ? 'bg-primary/20 text-primary-foreground' : 'hover:bg-muted'}`}
                  onClick={() => { setSelectedTrip(trip); setError(null); }}>
                <span className='font-medium'>{trip.destination}</span>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => e.stopPropagation()}>
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you sure?</DialogTitle>
                      <DialogDescription>
                        This will permanently delete your trip to {trip.destination}. This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="destructive" onClick={() => handleDeleteTrip(trip.id)}>Delete</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </button>
            </li>
          ))}
        </ul>
      ) : (
          <p className="text-sm text-muted-foreground px-2">No trips planned yet. Create one to get started!</p>
      )}
    </aside>
  );

  return (
    <div className="flex flex-col min-h-screen bg-secondary/20 dark:bg-zinc-900">
      <Header username={user.name} onLogout={onLogout} />
      <OfflineBanner />
      <div className="flex-grow container mx-auto p-4 md:p-6 grid grid-cols-12 gap-6">
        {sideBar}

        <main className="col-span-12 md:col-span-8 lg:col-span-9 xl:col-span-10 grid grid-cols-10 gap-6">
          <div className="col-span-10 lg:col-span-4">
              <Planner onPlanGenerated={handlePlanGenerated} isGenerating={isGenerating} />
          </div>
          <div className="col-span-10 lg:col-span-6">
              {/* FIX: Corrected the onRetry handler to pass a valid PlannerOptions object. */}
              {isGenerating ? <SkeletonLoader /> :
                error ? <ErrorState message={error} onRetry={() => handlePlanGenerated(trips.length > 0 ? trips[0] : {destination: "Paris", duration: 5, budget: 'Mid-Range', interests:['History']})} /> :
                selectedTrip ? <Itinerary plan={selectedTrip.itineraryJson} /> :
                !isLoadingTrips && <div className="h-full flex items-center justify-center bg-background rounded-lg shadow-sm"><p>Select a trip or create a new one to see the itinerary.</p></div>
              }
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardPage;