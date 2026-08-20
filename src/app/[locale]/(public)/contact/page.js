import { getLocale, getTranslations } from "next-intl/server";

export default async function ContactPage() {
  const locale = await getLocale();
  const t = await getTranslations("Contact");

  return (
    <>
      <p>Current locale: {locale}</p>

      <h1>{t("title")}</h1>
      <p>{t("intro")}</p>
      <p>{t("description")}</p>
    </>
  );
}
