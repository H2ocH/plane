import React from 'react';
import type { ItineraryPlan, DayPlan, Activity } from '../types';
import { PlaneIcon, HotelIcon, RestaurantIcon, MapPinIcon, SunIcon, MoonIcon, StarIcon } from './IconComponents';

const renderRating = (rating?: number) => {
    if (!rating) return null;
    return (
        <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
                <StarIcon key={i} isFilled={i < Math.round(rating)} className="w-4 h-4 text-yellow-400" />
            ))}
        </div>
    );
};

const ActivityCard: React.FC<{ icon: React.ReactNode, title: string, activity: Activity }> = ({ icon, title, activity }) => (
    <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            {icon}
        </div>
        <div>
            <h4 className="font-semibold text-gray-800">{title}: {activity.activity}</h4>
            <p className="text-gray-600 text-sm">{activity.description}</p>
        </div>
    </div>
);

const DayPlanCard: React.FC<{ dayPlan: DayPlan }> = ({ dayPlan }) => (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
        <div className="p-6 bg-gray-50 border-b">
            <h3 className="text-xl font-bold text-blue-700">Day {dayPlan.day}: {dayPlan.theme}</h3>
        </div>
        <div className="p-6 grid gap-6">
            <ActivityCard icon={<SunIcon className="w-5 h-5 text-blue-600"/>} title="Morning" activity={dayPlan.morning} />
            <ActivityCard icon={<MapPinIcon className="w-5 h-5 text-blue-600"/>} title="Afternoon" activity={dayPlan.afternoon} />
            <ActivityCard icon={<MoonIcon className="w-5 h-5 text-blue-600"/>} title="Evening" activity={dayPlan.evening} />
        </div>
        <div className="p-6 bg-gray-50 border-t">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <RestaurantIcon className="w-5 h-5 text-gray-600" />
                Dining Suggestions
            </h4>
            <div className="grid sm:grid-cols-2 gap-4">
                {dayPlan.restaurantSuggestions.map(resto => (
                    <div key={resto.name} className="bg-white p-3 rounded-lg border">
                        <div className="flex justify-between items-start">
                           <div>
                                <p className="font-semibold">{resto.name}</p>
                                <p className="text-sm text-gray-500">{resto.cuisine} - {resto.priceRange}</p>
                           </div>
                            {renderRating(resto.rating)}
                        </div>
                        {resto.details && <p className="text-xs text-gray-500 mt-1">{resto.details}</p>}
                    </div>
                ))}
            </div>
        </div>
    </div>
);


const Itinerary: React.FC<{ plan: ItineraryPlan }> = ({ plan }) => {
    const hotel = plan.itinerary[0]?.hotelSuggestion;

    return (
        <div className="mt-6">
            <div className="text-center mb-10">
                <h2 className="text-4xl font-extrabold text-gray-800 tracking-tight">Your Trip to {plan.destination}</h2>
                <p className="mt-2 text-lg text-gray-600">{plan.totalDays}-Day Itinerary</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <PlaneIcon className="w-6 h-6 text-blue-600"/>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">Flight Suggestion</h3>
                        <p className="text-gray-600">{plan.flightSuggestion.airline}: {plan.flightSuggestion.details}</p>
                    </div>
                </div>

                {hotel && (
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-start gap-4">
                       <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <HotelIcon className="w-6 h-6 text-blue-600"/>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">Accommodation</h3>
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-gray-600">{hotel.name} ({hotel.priceRange})</p>
                                    {hotel.details && <p className="text-sm text-gray-500 mt-1">{hotel.details}</p>}
                                </div>
                                {renderRating(hotel.rating)}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="space-y-8">
                {plan.itinerary.map((dayPlan) => (
                    <DayPlanCard key={dayPlan.day} dayPlan={dayPlan} />
                ))}
            </div>
        </div>
    );
};

export default Itinerary;
