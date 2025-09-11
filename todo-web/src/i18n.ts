import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// EN
import enAuth from "./locales/en/auth.json";
import enCommon from "./locales/en/common.json";
import enTodos from "./locales/en/todos.json";

// TH
import thAuth from "./locales/th/auth.json";
import thCommon from "./locales/th/common.json";
import thTodos from "./locales/th/todos.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { common: enCommon, auth: enAuth, todos: enTodos },
    th: { common: thCommon, auth: thAuth, todos: thTodos },
  },
  ns: ["common", "auth", "todos"],
  defaultNS: "common",
  lng: "th",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
