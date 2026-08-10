// src/components/Layout/Notification/Notification.jsx

"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, Check, Info, CircleCheck, TriangleAlert, CircleAlert } from "lucide-react";

import notificationsData from "@/data/notifications.json";
import styles from "./Notification.module.css";

const notificationIcons = {
  info: Info,
  success: CircleCheck,
  warning: TriangleAlert,
  error: CircleAlert,
};

export default function Notification() {
  const [isOpen, setIsOpen] = useState(false);

  const [notifications, setNotifications] = useState(notificationsData);

  const containerRef = useRef(null);

  /*
   * Count unread notifications
   */

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  /*
   * Limit badge to 99+
   */

  const badgeCount = unreadCount > 99 ? "99+" : unreadCount;

  /*
   * Close when clicking outside
   */

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
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

  /*
   * Open / close notification panel
   */

  function toggleNotifications() {
    setIsOpen((open) => !open);
  }

  /*
   * Mark one notification as read
   */

  function markAsRead(id) {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              read: true,
            }
          : notification,
      ),
    );
  }

  /*
   * Mark all notifications as read
   */

  function markAllAsRead() {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        read: true,
      })),
    );
  }

  return (
    <div
      className={styles.container}
      ref={containerRef}
    >
      {/* Bell button */}

      <button
        type='button'
        className={styles.trigger}
        onClick={toggleNotifications}
        aria-label={unreadCount > 0 ? `${unreadCount} unread notifications` : "Notifications"}
        aria-expanded={isOpen}
      >
        <Bell
          size={20}
          strokeWidth={1.8}
          aria-hidden='true'
        />

        {/* Unread badge */}

        {unreadCount > 0 && <span className={styles.badge}>{badgeCount}</span>}
      </button>

      {/* Notification dropdown */}

      {isOpen && (
        <div
          className={styles.dropdown}
          role='dialog'
          aria-label='Notifications'
        >
          {/* Header */}

          <div className={styles.header}>
            <h2 className={styles.title}>Notifications</h2>

            {unreadCount > 0 && (
              <button
                type='button'
                className={styles.markAll}
                onClick={markAllAsRead}
              >
                <Check size={15} />

                <span>Mark all as read</span>
              </button>
            )}
          </div>

          {/* Notification list */}

          <div className={styles.list}>
            {notifications.length === 0 ? (
              <div className={styles.empty}>No notifications</div>
            ) : (
              notifications.map((notification) => {
                /*
                 * Select the appropriate Lucide icon
                 */

                const Icon = notificationIcons[notification.type] || Info;

                return (
                  <button
                    type='button'
                    key={notification.id}
                    className={`${styles.item} ${!notification.read ? styles.unread : ""}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    {/* Notification type icon */}

                    <div className={`${styles.typeIcon} ${styles[notification.type]}`}>
                      <Icon
                        size={18}
                        strokeWidth={1.8}
                        aria-hidden='true'
                      />
                    </div>

                    {/* Notification content */}

                    <div className={styles.itemContent}>
                      <div className={styles.itemTitle}>{notification.title}</div>

                      <div className={styles.description}>{notification.description}</div>

                      <div className={styles.time}>{notification.time}</div>
                    </div>

                    {/* Unread dot */}

                    {!notification.read && (
                      <span
                        className={styles.unreadDot}
                        aria-label='Unread'
                      />
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Fixed footer */}

          <a
            href='/notifications'
            className={styles.footer}
          >
            View all notifications
          </a>
        </div>
      )}
    </div>
  );
}
