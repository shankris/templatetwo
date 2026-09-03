"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, ChevronDown, LogOut, Settings, UserRound, UsersRound, Mail } from "lucide-react";

import UserName from "../UserName/UserName";
import { getInitials, getAvatarColor } from "@/utils/user/userUtils";
import { formatSessionRelativeDate, formatSessionTime, formatSessionDuration } from "@/utils/user/sessionUtils";

import data from "./data.json";

import styles from "./LoggedInUser.module.css";

/* --------------------------------------------------
   LoggedInUser Component

   Displays the currently logged-in user.

   Clicking the user opens an account menu containing
   account information, preferences, user switching
   and logout options.
-------------------------------------------------- */

export default function LoggedInUser() {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(data.notifications?.enabled ?? false);
  const [imageError, setImageError] = useState(false);
  const { user, menu } = data;

  const initials = getInitials(user.name);
  const avatarColor = getAvatarColor(user.name);

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
   Format Session Duration
-------------------------------------------------- */

  const formatSessionDuration = (start, end) => {
    const startTime = new Date(start);
    const endTime = new Date(end);

    const difference = endTime - startTime;

    if (difference <= 0) {
      return "0m";
    }

    const totalMinutes = Math.floor(difference / 60000);

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours === 0) {
      return `${minutes}m`;
    }

    if (minutes === 0) {
      return `${hours}h`;
    }

    return `${hours}h ${minutes}m`;
  };

  /* --------------------------------------------------
     Toggle User Menu
  -------------------------------------------------- */

  const handleToggle = () => {
    setIsOpen((current) => !current);
  };

  /* --------------------------------------------------
     Toggle Notifications
  -------------------------------------------------- */

  const handleNotificationToggle = () => {
    setNotificationsEnabled((current) => !current);
  };

  /* --------------------------------------------------
   Close User Menu
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
          User Button
      ------------------------------------------------ */}

      <button
        type='button'
        className={styles.userButton}
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup='menu'
      >
        <div
          className={styles.avatar}
          style={{
            backgroundColor: user.image && !imageError ? undefined : avatarColor,
          }}
        >
          {user.image && !imageError ? (
            <img
              src={user.image}
              alt={user.name}
              className={styles.avatarImage}
              onError={() => setImageError(true)}
            />
          ) : (
            <span className={styles.initials}>{initials}</span>
          )}
        </div>

        <div className={styles.userInfo}>
          <UserName
            name={user.name}
            twoLines
          />

          <span className={styles.role}>{user.role}</span>
        </div>

        <ChevronDown
          size={16}
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
        />
      </button>

      {/* ------------------------------------------------
          Account Menu
      ------------------------------------------------ */}

      {isOpen && (
        <div
          className={styles.details}
          role='menu'
        >
          {/* --------------------------------------------
            Account Information
          -------------------------------------------- */}

          <div className={styles.accountInfo}>
            {/* ------------------------------------------
      Email
  ------------------------------------------ */}

            <div className={styles.menuItem}>
              <Mail size={16} />

              <span className={styles.emailText}>{user.email}</span>
            </div>

            {/* ------------------------------------------
                Last Session
              ------------------------------------------ */}
            {user.lastSession && (
              <div className={styles.lastSession}>
                <div className={styles.sessionLabel}>
                  <span>Last session -</span> <span className={styles.sessionRelative}>{formatSessionRelativeDate(user.lastSession.start)}</span>
                </div>

                <span className={styles.sessionTime}>{formatSessionTime(user.lastSession.start, user.lastSession.end)}</span>

                <span className={styles.sessionDuration}>{formatSessionDuration(user.lastSession.start, user.lastSession.end)}</span>
              </div>
            )}
          </div>

          {/* --------------------------------------------
              Account Options
          -------------------------------------------- */}

          {(menu.profile || menu.settings || menu.notifications) && (
            <div className={styles.menuSection}>
              {menu.profile && (
                <button
                  type='button'
                  className={styles.menuItem}
                  onClick={closeMenu}
                  role='menuitem'
                >
                  <UserRound size={16} />

                  <span>Profile</span>
                </button>
              )}

              {menu.settings && (
                <button
                  type='button'
                  className={styles.menuItem}
                  role='menuitem'
                  onClick={closeMenu}
                >
                  <Settings size={16} />

                  <span>Account settings</span>
                </button>
              )}

              {menu.notifications && (
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
              )}
            </div>
          )}

          {/* --------------------------------------------
    Session Actions
-------------------------------------------- */}

          {(menu.switchUser || menu.logout) && (
            <>
              <div className={styles.divider} />

              {menu.switchUser && (
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

              {menu.logout && (
                <button
                  type='button'
                  className={styles.menuItem}
                  role='menuitem'
                  onClick={closeMenu}
                >
                  <LogOut size={16} />

                  <span>Logout</span>
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
