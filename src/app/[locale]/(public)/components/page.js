import { getTranslations } from "next-intl/server";

export default async function ComponentsPage() {
  const t = await getTranslations("Components");

  return (
    <>
      <h1>{t("title")}</h1>

      <p>{t("description")}</p>
    </>
  );
}
