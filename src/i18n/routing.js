import { defineRouting } from "next-intl/routing";
import { localeCodes } from "./languages";

export const routing = defineRouting({
  locales: localeCodes,
  defaultLocale: "en",
});
