import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
import en from './locales/en/common.json';
import es from './locales/es/common.json';
import fr from './locales/fr/common.json';

const resources = {
  en: { translation: en },
  es: { translation: es },
  fr: { translation: fr },
};

i18n
  .use(initReactI18next) // Passes i18n instance to react-i18next
  .init({
    resources, // Translation files
    fallbackLng: 'en', // Default language
    supportedLngs: ['en', 'es', 'fr'],
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;
