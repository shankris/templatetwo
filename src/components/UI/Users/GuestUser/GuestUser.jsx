"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, ChevronDown, LogIn, UserPlus, UserRound, UsersRound, Mail } from "lucide-react";

import { formatSessionRelativeDate, formatSessionTime, formatSessionDuration } from "@/utils/user/sessionUtils";

import data from "./data.json";

import styles from "./GuestUser.module.css";

/* --------------------------------------------------
   GuestUser Component

   Displays the guest / signed-out user state.

   If a previous session is available, the component
   displays session information for the last session
   on this device.

   A previous session can be either:

   - guest
   - authenticated

   An email address may also be remembered independently
   of the previous session type.
-------------------------------------------------- */

export default function GuestUser() {
  const [isOpen, setIsOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(data.notifications?.enabled ?? false);
  const [previousSession, setPreviousSession] = useState(data.previousSession ?? null);

  const wrapperRef = useRef(null);

  const { guest, menu } = data;

  /* --------------------------------------------------
   Load Previous Session

   Session information is read from localStorage when
   available.

   The configured session in data.json is used as a
   fallback so the component can also be demonstrated
   without existing browser session data.
-------------------------------------------------- */

  useEffect(() => {
    try {
      const storedSession = localStorage.getItem("lastUserSession");

      if (!storedSession) {
        return;
      }

      const parsedSession = JSON.parse(storedSession);

      if (parsedSession?.lastSession) {
        setPreviousSession({
          ...data.previousSession,
          ...parsedSession,
          lastSession: {
            ...data.previousSession?.lastSession,
            ...parsedSession.lastSession,
          },
        });
      }
    } catch (error) {
      console.error("Unable to read previous user session.", error);
    }
  }, []);

  /* --------------------------------------------------
     Close Menu on Outside Click / Escape
  -------------------------------------------------- */

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleOutsideClick = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  /* --------------------------------------------------
     Toggle Guest Menu
  -------------------------------------------------- */

  const handleToggle = () => {
    setIsOpen((current) => !current);
  };

  /* --------------------------------------------------
     Toggle Notifications

     Clicking anywhere on the notification row
     toggles the notification setting while keeping
     the menu open.
  -------------------------------------------------- */

  const handleNotificationToggle = () => {
    setNotificationsEnabled((current) => !current);
  };

  /* --------------------------------------------------
     Close Menu

     Used by actions that navigate away from the menu.
  -------------------------------------------------- */

  const closeMenu = () => {
    setIsOpen(false);
  };

  /* --------------------------------------------------
     Render
  -------------------------------------------------- */

  return (
    <div
      ref={wrapperRef}
      className={styles.wrapper}
    >
      {/* ------------------------------------------------
          Guest Button
      ------------------------------------------------ */}

      <button
        type='button'
        className={styles.userButton}
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup='menu'
      >
        <div className={styles.avatar}>
          <UserRound
            size={20}
            strokeWidth={1.8}
          />
        </div>

        <div className={styles.userInfo}>
          <span className={styles.name}>{guest.name}</span>

          <span className={styles.role}>{guest.role}</span>
        </div>

        <ChevronDown
          size={16}
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
        />
      </button>

      {/* ------------------------------------------------
          Guest Menu
      ------------------------------------------------ */}

      {isOpen && (
        <div
          className={styles.details}
          role='menu'
        >
          {/* --------------------------------------------
              Previous Session
          -------------------------------------------- */}

          {previousSession?.lastSession && (
            <div className={styles.accountInfo}>
              <div className={styles.lastSession}>
                <div className={styles.sessionLabel}>
                  <span>{previousSession.type === "authenticated" ? "Last session -" : "Guest user session -"}</span>

                  <span className={styles.sessionRelative}>{formatSessionRelativeDate(previousSession.lastSession.start)}</span>
                </div>

                {/* --------------------------------------
                    Remembered Email

                    Only shown when the previous session
                    was authenticated.
                -------------------------------------- */}

                {previousSession.type === "authenticated" && previousSession.email && (
                  <div className={styles.sessionEmail}>
                    <Mail size={14} />

                    <span>{previousSession.email}</span>
                  </div>
                )}

                <span className={styles.sessionTime}>{formatSessionTime(previousSession.lastSession.start, previousSession.lastSession.end)}</span>

                <span className={styles.sessionDuration}>{formatSessionDuration(previousSession.lastSession.start, previousSession.lastSession.end)}</span>
              </div>
            </div>
          )}

          {/* --------------------------------------------
              Notification
          -------------------------------------------- */}

          {menu.notifications && (
            <div className={styles.menuSection}>
              <button
                type='button'
                className={styles.menuItem}
                onClick={handleNotificationToggle}
                role='menuitemcheckbox'
                aria-checked={notificationsEnabled}
              >
                <Bell size={16} />

                <span className={styles.menuItemLabel}>Notification</span>

                <span
                  className={`${styles.toggle} ${notificationsEnabled ? styles.toggleActive : ""}`}
                  aria-hidden='true'
                >
                  <span className={styles.toggleKnob} />
                </span>
              </button>
            </div>
          )}

          {/* --------------------------------------------
    Sign-up
-------------------------------------------- */}

          {menu.signup && (
            <button
              type='button'
              className={styles.menuItem}
              role='menuitem'
              onClick={closeMenu}
            >
              <UserPlus size={16} />

              <span>Sign-up</span>
            </button>
          )}

          {/* --------------------------------------------
              Login Actions
          -------------------------------------------- */}

          {(menu.switchUser || menu.login) && (
            <>
              <div className={styles.divider} />

              {/* ----------------------------------------
                  Login as Another User

                  Only shown when there is a previous
                  session to indicate that other users
                  have previously used this device.
              ---------------------------------------- */}

              {previousSession && menu.switchUser && (
                <button
                  type='button'
                  className={styles.menuItem}
                  role='menuitem'
                  onClick={closeMenu}
                >
                  <UsersRound size={16} />

                  <span>Login as another user</span>
                </button>
              )}

              {/* ----------------------------------------
                  Login

                  If a remembered email exists, offer
                  login using that email.

                  Otherwise simply show "Login".
              ---------------------------------------- */}

              {menu.login && (
                <button
                  type='button'
                  className={styles.menuItem}
                  role='menuitem'
                  onClick={closeMenu}
                >
                  <LogIn size={16} />

                  <span>{previousSession?.email ? `Login as ${previousSession.email}` : "Login"}</span>
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
