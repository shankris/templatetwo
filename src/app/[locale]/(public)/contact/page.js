import { getTranslations } from "next-intl/server";

export default async function ContactPage() {
  const t = await getTranslations("Contact");

  return (
    <main>
      <h1>{t("title")}</h1>
      <h2>{t("intro")}</h2>
      <p>{t("description")}</p>
      <p>{t("email")}</p>
    </main>
  );
}
