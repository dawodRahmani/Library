import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import da from './locales/da/translation.json';
import en from './locales/en/translation.json';

const savedLanguage = typeof window !== 'undefined'
    ? localStorage.getItem('language') || 'da'
    : 'da';

i18n.use(initReactI18next).init({
    resources: {
        da: { translation: da },
        en: { translation: en },
    },
    lng: savedLanguage,
    fallbackLng: 'da',
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
