// FIX: Manually define types for import.meta.env to work around type resolution issues.
// This ensures that TypeScript knows about Vite's environment variables and custom ones,
// resolving the "Property 'env' does not exist on type 'ImportMeta'" error.
interface ImportMetaEnv {
    readonly VITE_GEMINI_API_KEY: string;

    // Standard Vite env variables
    readonly BASE_URL: string
    readonly MODE: string
    readonly DEV: boolean
    readonly PROD: boolean
    readonly SSR: boolean
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
