import Link from "next/link";
import { notFound } from "next/navigation";

import componentNavigation from "@/data/componentNavigation.json";

export default async function ComponentsPage({ params }) {
  const { locale } = await params;

  const componentsItem = componentNavigation.find((item) => item.id === "components");

  if (!componentsItem) {
    notFound();
  }

  return (
    <div>
      <h1>{componentsItem.label}</h1>

      <p>Browse all components.</p>

      <div>
        {componentsItem.children?.map((item) => (
          <div key={item.id}>
            <h2>{item.label}</h2>

            <Link href={`/${locale}${item.href}`}>View {item.label} →</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
