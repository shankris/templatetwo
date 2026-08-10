// src/components/Layout/UserMenu/UserMenu.js

"use client";

import { useEffect, useRef, useState } from "react";
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

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
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

  return (
    <div
      className={styles.container}
      ref={menuRef}
    >
      <button
        type='button'
        className={styles.trigger}
        onClick={() => setIsOpen((open) => !open)}
        aria-label={user ? "Open user menu" : "Open account menu"}
        aria-expanded={isOpen}
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
            size={19}
            strokeWidth={1.8}
          />
        )}
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          {user ? (
            <>
              <div className={styles.userInfo}>
                <div className={styles.userName}>{user.name}</div>

                {user.email && <div className={styles.userEmail}>{user.email}</div>}
              </div>

              <div className={styles.divider} />

              <a
                href='/profile'
                className={styles.item}
              >
                <User size={17} />
                <span>Profile</span>
              </a>

              <a
                href='/settings'
                className={styles.item}
              >
                <Settings size={17} />
                <span>Settings</span>
              </a>

              <div className={styles.divider} />

              <button
                type='button'
                className={styles.item}
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
                />

                <span>Welcome</span>
              </div>

              <div className={styles.divider} />

              <a
                href='/login'
                className={styles.item}
              >
                <LogIn size={17} />
                <span>Log in</span>
              </a>

              <a
                href='/register'
                className={styles.item}
              >
                <UserPlus size={17} />
                <span>Register</span>
              </a>
            </>
          )}
        </div>
      )}
    </div>
  );
}
