import defaultImage from "./assets/images/gym-companion/gym-companion-logo.png";

const CONFIG = {
  name: "Gym Companion",

  origin: "https://gymcompanion.app",
  basePathname: "/",
  trailingSlash: "",

  title: "Gym Companion",
  description: "The only companion you need while working out",
  defaultImage: defaultImage,

  defaultTheme: "light",

  language: "en",
  textDirection: "ltr",

  dateFormatter: new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }),
};

export const SITE = { ...CONFIG };
export const DATE_FORMATTER = CONFIG.dateFormatter;
