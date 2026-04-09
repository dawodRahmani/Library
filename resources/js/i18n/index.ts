import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import da from './locales/da/translation.json';
import en from './locales/en/translation.json';
import ar from './locales/ar/translation.json';

const savedLanguage = typeof window !== 'undefined'
    ? (() => {
        // Try to get language from cookie first (sync with backend)
        const cookieMatch = document.cookie.match(/locale=([^;]+)/);
        if (cookieMatch && cookieMatch[1]) {
            return cookieMatch[1];
        }
        // Fallback to localStorage
        return localStorage.getItem('language') || 'da';
    })()
    : 'da';

i18n.use(initReactI18next).init({
    resources: {
        da: { translation: da },
        en: { translation: en },
        ar: { translation: ar },
    },
    lng: savedLanguage,
    fallbackLng: 'da',
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
