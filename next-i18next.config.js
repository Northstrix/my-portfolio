import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: require("./public/locales/en/translation.json"),
    },
    he: {
      translation: require("./public/locales/he/translation.json"),
    },
    es: {
      translation: require("./public/locales/es/translation.json"),
    },
    it: {
      translation: require("./public/locales/it/translation.json"),
    },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
