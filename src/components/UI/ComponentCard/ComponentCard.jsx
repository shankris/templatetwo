import Link from "next/link";

import styles from "./ComponentCard.module.css";

export default function ComponentCard({ title, description, href, locale }) {
  return (
    <article className={styles.card}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
        </div>

        <p className={styles.description}>{description}</p>

        <Link
          href={`/${locale}${href}`}
          className={styles.link}
        >
          <span>View component</span>
          <span aria-hidden='true'>→</span>
        </Link>
      </div>
    </article>
  );
}
