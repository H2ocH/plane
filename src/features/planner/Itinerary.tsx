import React from 'react';
import { ItineraryPlan, DayPlan, RestaurantSuggestion, HotelSuggestion } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaneIcon, HotelIcon, RestaurantIcon, MapPinIcon, SunIcon, MoonIcon, StarIcon } from '@/components/IconComponents';

interface ItineraryProps {
    plan: ItineraryPlan;
}

const Rating: React.FC<{ rating?: number }> = ({ rating }) => {
    if (typeof rating !== 'number') return null;
    return (
        <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
                <StarIcon key={i} isFilled={i < rating} className="h-4 w-4 text-yellow-500" />
            ))}
        </div>
    );
};

const HotelCard: React.FC<{ hotel: HotelSuggestion }> = ({ hotel }) => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg"><HotelIcon className="h-5 w-5" /> Hotel Suggestion</CardTitle>
        </CardHeader>
        <CardContent>
            <h4 className="font-semibold">{hotel.name}</h4>
            <p className="text-sm text-muted-foreground">{hotel.priceRange}</p>
            <Rating rating={hotel.rating} />
            {hotel.details && <p className="text-sm mt-1">{hotel.details}</p>}
        </CardContent>
    </Card>
);

const RestaurantsCard: React.FC<{ restaurants: RestaurantSuggestion[] }> = ({ restaurants }) => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg"><RestaurantIcon className="h-5 w-5" /> Restaurant Suggestions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
            {restaurants.map(r => (
                <div key={r.name}>
                    <h4 className="font-semibold">{r.name} ({r.cuisine})</h4>
                    <p className="text-sm text-muted-foreground">{r.priceRange}</p>
                    <Rating rating={r.rating} />
                    {r.details && <p className="text-sm mt-1">{r.details}</p>}
                </div>
            ))}
        </CardContent>
    </Card>
);

const DayPlanCard: React.FC<{ dayPlan: DayPlan }> = ({ dayPlan }) => (
    <Card>
        <CardHeader>
            <CardTitle>Day {dayPlan.day}: {dayPlan.theme}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
                <SunIcon className="h-5 w-5 mt-1 text-yellow-500 flex-shrink-0" />
                <div>
                    <h4 className="font-semibold">{dayPlan.morning.activity}</h4>
                    <p className="text-sm text-muted-foreground">{dayPlan.morning.description}</p>
                </div>
            </div>
            <div className="flex items-start gap-3">
                <MapPinIcon className="h-5 w-5 mt-1 text-blue-500 flex-shrink-0" />
                <div>
                    <h4 className="font-semibold">{dayPlan.afternoon.activity}</h4>
                    <p className="text-sm text-muted-foreground">{dayPlan.afternoon.description}</p>
                </div>
            </div>
            <div className="flex items-start gap-3">
                <MoonIcon className="h-5 w-5 mt-1 text-indigo-500 flex-shrink-0" />
                <div>
                    <h4 className="font-semibold">{dayPlan.evening.activity}</h4>
                    <p className="text-sm text-muted-foreground">{dayPlan.evening.description}</p>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-4">
                <HotelCard hotel={dayPlan.hotelSuggestion} />
                <RestaurantsCard restaurants={dayPlan.restaurantSuggestions} />
            </div>
        </CardContent>
    </Card>
);

const Itinerary: React.FC<ItineraryProps> = ({ plan }) => {
    return (
        <Card className="shadow-lg h-full overflow-y-auto">
            <CardHeader>
                <CardTitle className="text-2xl">Your Trip to {plan.destination}</CardTitle>
                <CardDescription>{plan.totalDays}-day personalized itinerary.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg"><PlaneIcon className="h-5 w-5" /> Flight Suggestion</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p><span className="font-semibold">{plan.flightSuggestion.airline}:</span> {plan.flightSuggestion.details}</p>
                    </CardContent>
                </Card>
                <div className="space-y-4">
                    {plan.itinerary.map(dayPlan => (
                        <DayPlanCard key={dayPlan.day} dayPlan={dayPlan} />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default Itinerary;
