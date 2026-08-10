// src/components/Layout/UserMenu/UserMenu.js

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { User, LogIn, UserPlus, Settings, LogOut } from "lucide-react";

import styles from "./UserMenu.module.css";

export default function UserMenu({ user = null }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);

      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : null;

  function toggleMenu() {
    setIsOpen((open) => !open);
  }

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <div
      ref={menuRef}
      className={styles.container}
    >
      <button
        type='button'
        className={styles.trigger}
        onClick={toggleMenu}
        aria-label={user ? "Open user menu" : "Open account menu"}
        aria-expanded={isOpen}
        aria-haspopup='menu'
      >
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt=''
            className={styles.avatar}
          />
        ) : initials ? (
          <span className={styles.initials}>{initials}</span>
        ) : (
          <User
            size={20}
            strokeWidth={1.7}
            aria-hidden='true'
          />
        )}
      </button>

      {isOpen && (
        <div
          className={styles.dropdown}
          role='menu'
        >
          {user ? (
            <>
              <div className={styles.userInfo}>
                <div className={styles.userName}>{user.name}</div>

                {user.email && <div className={styles.userEmail}>{user.email}</div>}
              </div>

              <div className={styles.divider} />

              <Link
                href='/profile'
                className={styles.item}
                role='menuitem'
                onClick={closeMenu}
              >
                <User size={17} />
                <span>Profile</span>
              </Link>

              <Link
                href='/settings'
                className={styles.item}
                role='menuitem'
                onClick={closeMenu}
              >
                <Settings size={17} />
                <span>Settings</span>
              </Link>

              <div className={styles.divider} />

              <button
                type='button'
                className={styles.item}
                role='menuitem'
                onClick={closeMenu}
              >
                <LogOut size={17} />
                <span>Log out</span>
              </button>
            </>
          ) : (
            <>
              <div className={styles.guest}>
                <User
                  size={22}
                  strokeWidth={1.7}
                  aria-hidden='true'
                />

                <span>Welcome</span>
              </div>

              <div className={styles.divider} />

              <Link
                href='/login'
                className={styles.item}
                role='menuitem'
                onClick={closeMenu}
              >
                <LogIn size={17} />
                <span>Log in</span>
              </Link>

              <Link
                href='/register'
                className={styles.item}
                role='menuitem'
                onClick={closeMenu}
              >
                <UserPlus size={17} />
                <span>Register</span>
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
