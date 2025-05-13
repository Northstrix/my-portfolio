import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: require("./public/locales/en/translation.json"), // English
    },
    he: {
      translation: require("./public/locales/he/translation.json"), // Hebrew
    },
    es_ar: {
      translation: require("./public/locales/es_ar/translation.json"), // Argentinian Spanish
    },
    de: {
      translation: require("./public/locales/de/translation.json"), // German
    },
    ru: {
      translation: require("./public/locales/ru/translation.json"), // Russian
    },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
