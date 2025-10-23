import React, { useState, useEffect, useCallback } from 'react';
import { createTrip, getTrips, deleteTrip } from '../services/apiService';
import type { Trip, PlannerOptions } from '../types';
import Planner from './Planner';
import Itinerary from './Itinerary';
import SkeletonLoader from './SkeletonLoader';
import { useToast } from './ui/Toast';
import { Dialog } from './ui/Dialog';
import { TrashIcon } from './IconComponents';
import ErrorState from './ErrorState';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

const Dashboard: React.FC = () => {
    const [trips, setTrips] = useState<Trip[]>([]);
    const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [tripToDelete, setTripToDelete] = useState<string | null>(null);

    const { toast } = useToast();
    const isOnline = useOnlineStatus();

    const loadTrips = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const fetchedTrips = await getTrips();
            setTrips(fetchedTrips);
            if (fetchedTrips.length > 0 && !selectedTrip) {
                setSelectedTrip(fetchedTrips[0]);
            }
        } catch (e) {
            setError("Failed to load your trips. Please try refreshing the page.");
            toast({ title: 'Error', description: (e as Error).message, variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    }, [selectedTrip, toast]);

    useEffect(() => {
        loadTrips();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    // Deliberately empty to only run once on mount

    const handlePlanGenerated = async (options: PlannerOptions) => {
        if (!isOnline) {
            toast({ title: "You're offline!", description: "Please check your connection and try again.", variant: 'destructive' });
            return;
        }
        setIsGenerating(true);
        setError(null);
        try {
            const newTrip = await createTrip(options);
            setTrips(prevTrips => [newTrip, ...prevTrips]);
            setSelectedTrip(newTrip);
            toast({ title: 'Success!', description: 'Your new itinerary has been created.' });
        } catch (e) {
            const errorMessage = (e as Error).message;
            setError(errorMessage);
            toast({
                title: 'Generation Failed',
                description: errorMessage,
                variant: 'destructive',
                action: { label: 'Retry', onClick: () => handlePlanGenerated(options) }
            });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDeleteTrip = async () => {
        if (!tripToDelete) return;
        
        const originalTrips = [...trips];
        const tripToRemove = trips.find(t => t.id === tripToDelete);

        // Optimistic UI update
        const newTrips = trips.filter(t => t.id !== tripToDelete);
        setTrips(newTrips);
        
        if (selectedTrip?.id === tripToDelete) {
            setSelectedTrip(newTrips[0] || null);
        }

        setIsDeleteDialogOpen(false);

        try {
            await deleteTrip(tripToDelete);
            toast({ title: 'Trip Deleted', description: `Your trip to ${tripToRemove?.destination} was deleted.` });
        } catch (e) {
            // Rollback on failure
            setTrips(originalTrips);
            toast({ title: 'Delete Failed', description: (e as Error).message, variant: 'destructive' });
        } finally {
            setTripToDelete(null);
        }
    };

    const openDeleteDialog = (tripId: string) => {
        setTripToDelete(tripId);
        setIsDeleteDialogOpen(true);
    };

    return (
        <div>
            <Planner onPlanGenerated={handlePlanGenerated} isLoading={isGenerating} />

            {isGenerating && <SkeletonLoader />}

            {error && !isGenerating && <ErrorState message={error} onRetry={loadTrips} />}

            {!isLoading && !error && trips.length > 0 && (
                <div className="grid grid-cols-12 gap-8">
                    <aside className="col-span-12 lg:col-span-3">
                        <h3 className="text-lg font-semibold mb-4 px-2">Your Trips</h3>
                        <ul className="space-y-2">
                            {trips.map(trip => (
                                <li key={trip.id}>
                                    <button 
                                        onClick={() => setSelectedTrip(trip)}
                                        className={`w-full text-left p-3 rounded-lg transition-colors flex justify-between items-center group ${selectedTrip?.id === trip.id ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}
                                    >
                                        <div>
                                            <p className="font-semibold">{trip.destination}</p>
                                            <p className={`text-sm ${selectedTrip?.id === trip.id ? 'text-blue-200' : 'text-gray-500'}`}>{trip.duration} days</p>
                                        </div>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); openDeleteDialog(trip.id); }}
                                            className={`p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${selectedTrip?.id === trip.id ? 'hover:bg-blue-700' : 'hover:bg-red-100 text-red-600'}`}
                                            aria-label={`Delete trip to ${trip.destination}`}
                                        >
                                            <TrashIcon className="w-5 h-5"/>
                                        </button>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </aside>
                    <main className="col-span-12 lg:col-span-9">
                        {selectedTrip ? <Itinerary plan={selectedTrip.itineraryJson} /> : <p>Select a trip to view.</p>}
                    </main>
                </div>
            )}

            {!isLoading && !isGenerating && !error && trips.length === 0 && (
                <div className="text-center py-16 px-6 bg-white rounded-lg border">
                    <h3 className="text-xl font-semibold text-gray-800">No trips yet!</h3>
                    <p className="text-gray-500 mt-2">Use the planner above to create your first travel itinerary.</p>
                </div>
            )}
            
            <Dialog 
                isOpen={isDeleteDialogOpen} 
                onClose={() => setIsDeleteDialogOpen(false)}
                title="Confirm Deletion"
            >
                <div>
                    <p>Are you sure you want to delete this trip? This action cannot be undone.</p>
                    <div className="mt-6 flex justify-end space-x-3">
                        <button onClick={() => setIsDeleteDialogOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                        <button onClick={handleDeleteTrip} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Delete</button>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default Dashboard;
