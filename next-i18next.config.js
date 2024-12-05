// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: require('./public/locales/en/translation.json'),
      },
      he: {
        translation: require('./public/locales/he/translation.json'),
      },
      es: {
        translation: require('./public/locales/es/translation.json'),
      },
      de: {
        translation: require('./public/locales/de/translation.json'),
      },
      ru: {
        translation: require('./public/locales/ru/translation.json'),
      },
    },
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already does escaping
    },
  });

export default i18n;