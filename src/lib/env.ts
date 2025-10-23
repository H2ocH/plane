import { z } from 'zod';

const envSchema = z.object({
  VITE_GEMINI_API_KEY: z.string().min(1, 'VITE_GEMINI_API_KEY is required in your .env file'),
});

const parsedEnv = envSchema.safeParse(import.meta.env);

if (!parsedEnv.success) {
  console.error(
    '🔥 Invalid environment variables:',
    parsedEnv.error.flatten().fieldErrors
  );
  throw new Error('Invalid environment variables.');
}

export const env = parsedEnv.data;
