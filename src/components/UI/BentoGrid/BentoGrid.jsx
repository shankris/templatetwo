"use client";

import styles from "./BentoGrid.module.css";

const items = [
  {
    id: 1,
    className: "item1",
    title: "About Me",
    content: "Front-end developer focused on creating thoughtful digital experiences.",
  },
  {
    id: 2,
    className: "item2",
    title: "Projects",
    content: "Selected projects and experiments.",
  },
  {
    id: 3,
    className: "item3",
    title: "Skills",
    content: "React, Next.js, JavaScript and modern front-end technologies.",
  },
  {
    id: 4,
    className: "item4",
    title: "Components",
    content: "Reusable UI components and interaction patterns.",
  },
  {
    id: 5,
    className: "item5",
    title: "Experience",
    content: "A selection of professional experience and work.",
  },
  {
    id: 6,
    className: "item6",
    title: "Design",
    content: "Design systems, interfaces and visual exploration.",
  },
  {
    id: 7,
    className: "item7",
    title: "Contact",
    content: "Let's work together.",
  },
  {
    id: 8,
    className: "item8",
    title: "Learning",
    content: "Things I'm currently exploring and learning.",
  },
  {
    id: 9,
    className: "item9",
    title: "More",
    content: "Additional work and experiments.",
  },
];

export default function BentoGrid() {
  return (
    <section className={styles.grid}>
      {items.map((item) => (
        <article
          key={item.id}
          className={`${styles.card} ${styles[item.className]}`}
        >
          <h3>{item.title}</h3>
          <p>{item.content}</p>
        </article>
      ))}
    </section>
  );
}
