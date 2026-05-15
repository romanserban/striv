import * as Localization from "expo-localization";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import en from "@/locales/en/common.json";
import ro from "@/locales/ro/common.json";

const deviceLanguage = Localization.getLocales()[0]?.languageCode ?? "en";
const supportedLanguage = deviceLanguage === "ro" ? "ro" : "en";

// eslint-disable-next-line import/no-named-as-default-member
i18next.use(initReactI18next).init({
  compatibilityJSON: "v4",
  resources: {
    en: { common: en },
    ro: { common: ro }
  },
  lng: supportedLanguage,
  fallbackLng: "en",
  defaultNS: "common",
  interpolation: {
    escapeValue: false
  }
});

export default i18next;
