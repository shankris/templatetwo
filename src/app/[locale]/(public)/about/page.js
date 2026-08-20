import { getTranslations } from "next-intl/server";

export default async function AboutPage() {
  const t = await getTranslations("About");

  return (
    <main>
      <h1>{t("title")}</h1>
      <h2>{t("intro")}</h2>
      <p>{t("description")}</p>
      <p>{t("details")}</p>
    </main>
  );
}
