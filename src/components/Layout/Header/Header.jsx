// src/components/Layout/Header/Header.jsx

"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { useState } from "react";

import navigation from "@/data/navigation.json";
import applicationNavigation from "@/data/applicationNavigation.json";
import loggedInNavigation from "@/data/loggedInNavigation.json";

import ThemeToggle from "../ThemeToggle/ThemeToggle";
import MenuButton from "../MenuButton/MenuButton";
import FullScreenMenu from "../FullScreenMenu/FullScreenMenu";
import UserMenu from "../UserMenu/UserMenu";
import Notification from "../Notification/Notification";

import styles from "./Header.module.css";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const isLoggedIn = true;

  // temporary - remove later
  const user = isLoggedIn
    ? {
        name: "Shankar Krishnasamy",
        email: "shankar@example.com",
      }
    : null;

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <>
      <header className={styles.header}>
        <div className={styles.content}>
          <div className={styles.brand}>Project Template</div>

          <nav className={styles.navigation}>
            {navigation.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={styles.link}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className={styles.actions}>
            <Notification />
            <ThemeToggle />
            <UserMenu user={user} />
            <MenuButton
              isOpen={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            />
          </div>
        </div>
      </header>

      <FullScreenMenu
        isOpen={menuOpen}
        items={isLoggedIn ? loggedInNavigation : navigation}
        sideItems={isLoggedIn ? applicationNavigation : []}
        onNavigate={() => setMenuOpen(false)}
      />
    </>
  );
}
