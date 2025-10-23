/**
 * NOTE: This is a conceptual backend file providing code stubs.
 * It's intended to be run in a Node.js/Express environment with accompanying packages.
 */
import { GoogleGenAI, Type } from "@google/genai";
import { z } from 'zod'; // Hypothetical import
import { ItineraryPlan, PlannerOptions } from '../types';

// ===============================================================================
// 1. ZOD VALIDATORS - for robust input validation
// ===============================================================================

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const tripCreationSchema = z.object({
  destination: z.string().min(2),
  duration: z.number().int().min(1).max(30),
  budget: z.enum(['Budget-Friendly', 'Mid-Range', 'Luxury']),
  interests: z.array(z.string()).min(1),
});


// ===============================================================================
// 2. GEMINI SERVICE (SERVER-SIDE)
// ===============================================================================

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// FIX: Populating the response schema for Gemini API call.
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

async function serverGenerateTravelPlan(options: PlannerOptions): Promise<ItineraryPlan> {
  const { destination, duration, budget, interests } = options;
  const prompt = `
    You are an expert travel planner. Create a detailed, day-by-day travel itinerary for a trip to ${destination} for ${duration} days.
    The traveler's budget is ${budget} and their interests include: ${interests.join(', ')}.
    For each day, provide a theme, and suggest activities for the morning, afternoon, and evening.
    Also, suggest ONE hotel suitable for the entire trip with details.
    For each day, suggest at least TWO different restaurants that match the budget with details.
    Finally, suggest a suitable airline for the trip with brief details.
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
// 3. CONCEPTUAL API ROUTE HANDLERS (for an Express.js app)
// ===============================================================================

// app.post('/api/auth/login', (req, res) => { ... });
async function handleLogin(req, res) {
  // 1. Validate input
  const validation = loginSchema.safeParse(req.body);
  if (!validation.success) return res.status(400).json({ error: 'Invalid input' });
  
  // 2. Find user in DB (e.g., using Prisma)
  // const user = await prisma.user.findUnique({ where: { email: validation.data.email } });
  
  // 3. Compare password hash
  // const passwordMatch = await bcrypt.compare(validation.data.password, user.password);
  
  // 4. If valid, create JWT
  // const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  
  // 5. Respond with token and user info
  // res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  
  // --- MOCK RESPONSE ---
  const { email } = validation.data;
  const user = { id: 'mock-user-123', name: email.split('@')[0], email };
  res.json({ token: 'mock-jwt-token', user });
}

// app.get('/api/auth/me', authMiddleware, (req, res) => { ... });
async function handleGetMe(req, res) {
  // The authMiddleware would have already verified the JWT and attached user to req.
  // const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
  // res.json({ user: { id: user.id, name: user.name, email: user.email } });

  // --- MOCK RESPONSE ---
  res.json({ user: { id: 'mock-user-123', name: 'Mock User', email: 'mock.user@example.com' } });
}


// app.get('/api/trips', authMiddleware, (req, res) => { ... });
async function handleGetTrips(req, res) {
  // const trips = await prisma.trip.findMany({ where: { userId: req.user.userId }, orderBy: { createdAt: 'desc' } });
  // res.json(trips);

  // --- MOCK RESPONSE ---
  res.json([]); // Return empty array for now
}


// app.post('/api/trips', authMiddleware, (req, res) => { ... });
async function handleCreateTrip(req, res) {
  // 1. Validate input
  const validation = tripCreationSchema.safeParse(req.body);
  if (!validation.success) return res.status(400).json({ error: 'Invalid input' });

  // 2. Call Gemini to generate the plan
  const itineraryJson = await serverGenerateTravelPlan(validation.data);
  
  // 3. Save to database
  // const newTrip = await prisma.trip.create({
  //   data: {
  //     ...validation.data,
  //     itineraryJson,
  //     userId: req.user.userId,
  //   }
  // });
  
  // 4. Respond with the new trip data
  // res.status(201).json(newTrip);

  // --- MOCK RESPONSE ---
  const newTrip = {
    id: `trip_${Date.now()}`,
    ...validation.data,
    itineraryJson,
    userId: 'mock-user-123',
    createdAt: new Date().toISOString()
  };
  res.status(201).json(newTrip);
}
