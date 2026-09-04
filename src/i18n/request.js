import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

/* --------------------------------------------------
   Load Locale Messages
-------------------------------------------------- */

async function loadMessages(locale) {
  const [site, sidebar, home, about, contact, components] = await Promise.all([import(`./messages/${locale}/site.json`), import(`./messages/${locale}/sidebar.json`), import(`./messages/${locale}/home.json`), import(`./messages/${locale}/about.json`), import(`./messages/${locale}/contact.json`), import(`./messages/${locale}/components.json`)]);

  return {
    Header: site.default.Header,
    UserMenu: site.default.UserMenu,
    Footer: site.default.Footer,
    Sidebar: sidebar.default,
    Home: home.default,
    About: about.default,
    Contact: contact.default,
    Components: components.default,
  };
}

/* --------------------------------------------------
   Next Intl Request Configuration
-------------------------------------------------- */

export default getRequestConfig(async ({ requestLocale }) => {
  const requestedLocale = await requestLocale;

  const locale = routing.locales.includes(requestedLocale) ? requestedLocale : routing.defaultLocale;

  return {
    locale,
    messages: await loadMessages(locale),
  };
});
