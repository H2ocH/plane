import type { User, Trip, PlannerOptions, ItineraryPlan } from '../types';
import { GoogleGenAI, Type } from "@google/genai";

// This service simulates a backend API.
// In a real application, these functions would make network requests.

const USER_KEY = 'trip_planner_user';
const TRIPS_KEY = 'trip_planner_trips';


// ===============================================================================
// Mock Gemini API call - In a real app this would be on a secure backend.
// As per the project structure with `api/backend.ts`, this logic is representative
// of what the backend would do. We include it here to make the frontend functional
// without a live backend server.
// ===============================================================================

async function generatePlanWithGemini(options: PlannerOptions): Promise<ItineraryPlan> {
  if (!process.env.API_KEY) {
    console.warn("API_KEY not found. Using mock data.");
    // Return a mock plan if API key is not available
    return {
        destination: options.destination,
        totalDays: options.duration,
        flightSuggestion: { airline: "MockAir", details: "Direct flight, 8 hours." },
        itinerary: Array.from({ length: options.duration }, (_, i) => ({
            day: i + 1,
            theme: `Exploring ${options.interests[0] || 'the city'}`,
            morning: { activity: "Visit a local landmark", description: "A beautiful and historic site." },
            afternoon: { activity: "Lunch at a cafe", description: "Enjoy local cuisine." },
            evening: { activity: "Evening stroll", description: "Relax and enjoy the city lights." },
            hotelSuggestion: { name: "The Grand Mock Hotel", priceRange: "$$$-$$$$", rating: 5, details: "5-star luxury hotel." },
            restaurantSuggestions: [
                { name: "The Mock Bistro", cuisine: "International", priceRange: "$$$", rating: 4 },
                { name: "Local Eats Mock", cuisine: "Local", priceRange: "$$", rating: 5 },
            ],
        })),
    };
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const responseSchema = {
      type: Type.OBJECT,
      properties: {
        destination: { type: Type.STRING },
        totalDays: { type: Type.INTEGER },
        flightSuggestion: {
            type: Type.OBJECT,
            properties: {
                airline: { type: Type.STRING },
                details: { type: Type.STRING },
            },
            required: ['airline', 'details']
        },
        itinerary: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              day: { type: Type.INTEGER },
              theme: { type: Type.STRING },
              morning: {
                type: Type.OBJECT,
                properties: {
                  activity: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
                required: ['activity', 'description']
              },
              afternoon: {
                type: Type.OBJECT,
                properties: {
                  activity: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
                required: ['activity', 'description']
              },
              evening: {
                type: Type.OBJECT,
                properties: {
                  activity: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
                required: ['activity', 'description']
              },
              hotelSuggestion: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  priceRange: { type: Type.STRING },
                  rating: { type: Type.NUMBER },
                  details: { type: Type.STRING },
                },
                required: ['name', 'priceRange']
              },
              restaurantSuggestions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    cuisine: { type: Type.STRING },
                    priceRange: { type: Type.STRING },
                    rating: { type: Type.NUMBER },
                    details: { type: Type.STRING },
                  },
                  required: ['name', 'cuisine', 'priceRange']
                }
              }
            },
            required: ['day', 'theme', 'morning', 'afternoon', 'evening', 'hotelSuggestion', 'restaurantSuggestions']
          }
        }
      },
      required: ['destination', 'totalDays', 'itinerary', 'flightSuggestion']
  };

  const { destination, duration, budget, interests } = options;
  const prompt = `
    You are an expert travel planner. Create a detailed, day-by-day travel itinerary for a trip to ${destination} for ${duration} days.
    The traveler's budget is ${budget} and their interests include: ${interests.join(', ')}.
    For each day, provide a theme, and suggest activities for the morning, afternoon, and evening with detailed descriptions.
    Also, suggest ONE hotel suitable for the entire trip with details like a star rating (1-5).
    For each day, suggest at least TWO different restaurants that match the budget with details like cuisine type and a star rating (1-5).
    Finally, suggest a suitable airline for the trip with brief details.
    The hotel suggestion should be consistent across all days in the itinerary array.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-pro',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: responseSchema,
      temperature: 0.7,
    }
  });

  const jsonText = response.text.trim();
  try {
    return JSON.parse(jsonText) as ItineraryPlan;
  } catch (e) {
    console.error("Failed to parse JSON response:", jsonText);
    throw new Error("Invalid JSON response from the model.");
  }
}


// ===============================================================================
// Mock API Service
// ===============================================================================

export const login = (email: string, password: string): Promise<{ user: User }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Mock login logic
      if (email && password) {
        const user: User = {
          id: 'user-123',
          name: email.split('@')[0].replace(/^\w/, (c) => c.toUpperCase()),
          email: email,
        };
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        resolve({ user });
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 1000);
  });
};

export const logout = (): void => {
  localStorage.removeItem(USER_KEY);
};

export const getMe = (): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const userJson = localStorage.getItem(USER_KEY);
      if (userJson) {
        resolve(JSON.parse(userJson) as User);
      } else {
        reject(new Error('Not authenticated'));
      }
    }, 200);
  });
};

export const getTrips = (): Promise<Trip[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const tripsJson = localStorage.getItem(TRIPS_KEY);
            if (tripsJson) {
                resolve(JSON.parse(tripsJson) as Trip[]);
            } else {
                resolve([]);
            }
        }, 500);
    });
};

export const createTrip = async (options: PlannerOptions): Promise<Trip> => {
    console.log("Generating travel plan with options:", options);
    
    // Simulate a potential API failure to test retry logic
    if (Math.random() < 0.3) {
      console.log("Simulating trip creation failure...");
      await new Promise(resolve => setTimeout(resolve, 1500));
      throw new Error("The AI model is currently busy. Please try again.");
    }

    const itineraryJson = await generatePlanWithGemini(options);
    const user = await getMe();
    const existingTrips = await getTrips();
    
    const newTrip: Trip = {
        id: `trip_${Date.now()}`,
        ...options,
        itineraryJson,
        userId: user.id,
        createdAt: new Date().toISOString()
    };
    
    const updatedTrips = [newTrip, ...existingTrips];
    localStorage.setItem(TRIPS_KEY, JSON.stringify(updatedTrips));

    return newTrip;
};

export const deleteTrip = (tripId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      // Simulate a potential API failure for rollback testing
      if (Math.random() < 0.2) {
        console.log(`Simulating deletion failure for trip ${tripId}`);
        return reject(new Error("Failed to sync deletion with the server."));
      }

      const existingTrips = await getTrips();
      const updatedTrips = existingTrips.filter(t => t.id !== tripId);
      localStorage.setItem(TRIPS_KEY, JSON.stringify(updatedTrips));
      console.log(`Successfully deleted trip ${tripId}`);
      resolve();
    }, 1000);
  });
};
