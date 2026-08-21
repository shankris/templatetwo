import Link from "next/link";
import { notFound } from "next/navigation";

import componentNavigation from "@/data/componentNavigation.json";
import componentList from "@/data/components.json";
import * as Components from "@/components/UI";

function findNavigationItem(items, pathname) {
  for (const item of items) {
    if (item.href === pathname) {
      return item;
    }

    if (item.children) {
      const found = findNavigationItem(item.children, pathname);

      if (found) {
        return found;
      }
    }
  }

  return null;
}

export default async function ComponentRoute({ params }) {
  const { locale, slug } = await params;

  const currentPath = `/components/${slug.join("/")}`;

  const navigationItem = findNavigationItem(componentNavigation, currentPath);

  if (!navigationItem) {
    notFound();
  }

  /*
   * --------------------------------------------------
   * CATEGORY / PARENT
   * --------------------------------------------------
   */

  if (navigationItem.children?.length) {
    return (
      <div>
        <h1>{navigationItem.label}</h1>

        <p>Browse {navigationItem.label}.</p>

        <div>
          {navigationItem.children.map((child) => (
            <div key={child.id}>
              <h2>{child.label}</h2>

              <Link href={`/${locale}${child.href}`}>View {child.label} →</Link>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /*
   * --------------------------------------------------
   * LEAF / COMPONENT
   * --------------------------------------------------
   */

  const componentMetadata = componentList.find((item) => item.slug === navigationItem.id || item.slug === slug.at(-1));

  if (!componentMetadata) {
    return (
      <div>
        <h1>{navigationItem.label}</h1>

        <p>This component has not been added to components.json yet.</p>
      </div>
    );
  }

  const Component = Components[componentMetadata.component];

  if (!Component) {
    return (
      <div>
        <h1>{componentMetadata.displayName}</h1>

        <p>Component "{componentMetadata.component}" is not implemented.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>{componentMetadata.displayName}</h1>

      <p>{componentMetadata.description}</p>

      <Component />
    </div>
  );
}
