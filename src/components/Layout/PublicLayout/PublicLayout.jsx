// src/components/Layout/PublicLayout/PublicLayout.jsx

import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import styles from "./PublicLayout.module.css";

export default function PublicLayout({ children }) {
  return (
    <div className={styles.layout}>
      <Header />

      <main className={styles.main}>{children}</main>

      <Footer />
    </div>
  );
}
