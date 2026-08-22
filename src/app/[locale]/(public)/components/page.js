import componentNavigation from "@/data/componentNavigation.json";
import componentList from "@/data/components.json";

import ComponentCard from "@/components/UI/ComponentCard/ComponentCard";

import styles from "./page.module.css";

export default async function ComponentsPage({ params }) {
  const { locale } = await params;

  const componentsItem = componentNavigation.find((item) => item.id === "components");

  if (!componentsItem) {
    return null;
  }

  function getComponentMetadata(item) {
    const slug = item.href?.split("/").filter(Boolean).at(-1);

    return componentList.find((component) => component.slug === slug);
  }

  return (
    <main className={styles.page}>
      <header className={styles.pageHeader}>
        <h1>{componentsItem.label}</h1>

        <p>A collection of reusable components for building modern web applications.</p>
      </header>

      <div className={styles.categories}>
        {componentsItem.children?.map((category) => (
          <section
            key={category.id}
            className={styles.category}
          >
            <header className={styles.categoryHeader}>
              <h2>{category.label}</h2>
            </header>

            <div className={styles.cards}>
              {category.children?.map((item) => {
                const metadata = getComponentMetadata(item);

                return (
                  <ComponentCard
                    key={item.id}
                    title={metadata?.displayName || item.label}
                    description={metadata?.description || `Explore the ${item.label} components.`}
                    href={item.href}
                    locale={locale}
                  />
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
