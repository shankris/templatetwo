import TechStack from "@/components/UI/TechStack/TechStack";

import { getTranslations } from "next-intl/server";
import styles from "./page.module.css";

export default async function HomePage() {
  const t = await getTranslations("Home");

  return (
    <main className={styles.hero}>
      <section className={styles.heroSection}>
        <h1 className={styles.hero}>{t("title")}</h1>
        <div className={styles.subHead}>{t("description")}</div>

        <TechStack />
      </section>

      <section className={styles.home}>
        <div>Left</div>
        <div>Center</div>
        <div>Right</div>
      </section>
      <section className={styles.home}>
        <div>Left half</div>
        <div>Right half</div>
      </section>
      <section className={styles.home}>
        <div>Left half</div>
        <div>Right half</div>
      </section>
      <section className={styles.home}>
        <div>Left half</div>
        <div>Right half</div>
      </section>
    </main>
  );
}
