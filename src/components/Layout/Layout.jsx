import styles from "./Layout.module.css";

export default function Layout({ header, children, footer }) {
  return (
    <div className={styles.layout}>
      {header}

      <main className={styles.main}>{children}</main>

      {footer}
    </div>
  );
}
