import { useMemo } from 'react';

// In a real app, this would be more sophisticated, likely using a library
// like i18next and loading translations from JSON files.
const translations = {
  en: {
    welcome: 'Welcome Back',
    loginFailed: 'Login Failed',
    // ... add other translations
  },
  es: {
    welcome: 'Bienvenido de nuevo',
    loginFailed: 'Error de inicio de sesión',
    // ...
  }
};

type Language = keyof typeof translations;

export function useTranslations(lang: Language = 'en') {
  const t = useMemo(() => {
    return (key: keyof typeof translations['en']) => {
      return translations[lang][key] || key;
    };
  }, [lang]);

  return { t };
}
