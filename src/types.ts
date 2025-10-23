// ====== Frontend-specific types ======

export interface PlannerOptions {
  destination: string;
  duration: number;
  budget: 'Budget-Friendly' | 'Mid-Range' | 'Luxury';
  interests: string[];
}


// ====== Types for Gemini API JSON response ======

export interface Activity {
  activity: string;
  description: string;
}

export interface HotelSuggestion {
  name: string;
  priceRange: string;
  rating?: number;
  details?: string;
}

export interface RestaurantSuggestion {
  name: string;
  cuisine: string;
  priceRange: string;
  rating?: number;
  details?: string;
}

export interface DayPlan {
  day: number;
  theme: string;
  morning: Activity;
  afternoon: Activity;
  evening: Activity;
  hotelSuggestion: HotelSuggestion;
  restaurantSuggestions: RestaurantSuggestion[];
}

export interface FlightSuggestion {
    airline: string;
    details: string;
}

export interface ItineraryPlan {
  destination: string;
  totalDays: number;
  itinerary: DayPlan[];
  flightSuggestion: FlightSuggestion;
}


// ====== Backend API / Database types ======

export interface User {
    id: string;
    name: string;
    email: string;
}

export interface Trip {
    id: string;
    destination: string;
    duration: number;
    // FIX: Changed budget from 'string' to a specific union type to match PlannerOptions
    budget: 'Budget-Friendly' | 'Mid-Range' | 'Luxury';
    interests: string[];
    createdAt: string;
    itineraryJson: ItineraryPlan;
    userId: string;
}

// ====== UI Component Types ======

export type ToastAction = {
  label: string;
  onClick: () => void;
};

export type Toast = {
  id?: string;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
  action?: ToastAction;
};
