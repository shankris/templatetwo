"use client";

import { animate, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { useTranslations } from "next-intl";

import styles from "./TechStack.module.css";
import data from "./data.json";

const SCALE = 1.5;
const DISTANCE = 110;
const NUDGE = 40;

const SPRING = {
  mass: 0.1,
  stiffness: 170,
  damping: 12,
};

export default function TechStack() {
  const t = useTranslations("HomePage.techStack");

  const mouseLeft = useMotionValue(-Infinity);
  const mouseRight = useMotionValue(-Infinity);

  const left = useTransform(mouseLeft, [0, 40], [0, -40]);
  const right = useTransform(mouseRight, [0, 40], [0, -40]);

  const leftSpring = useSpring(left, SPRING);
  const rightSpring = useSpring(right, SPRING);

  return (
    <>
      {/* Desktop Tech Stack */}

      <div className={styles.sectionTitle}>
        <span>Tech Stack</span>
      </div>

      <motion.div
        onMouseMove={(event) => {
          const { left, right } = event.currentTarget.getBoundingClientRect();

          const offsetLeft = event.clientX - left;
          const offsetRight = right - event.clientX;

          mouseLeft.set(offsetLeft);
          mouseRight.set(offsetRight);
        }}
        onMouseLeave={() => {
          mouseLeft.set(-Infinity);
          mouseRight.set(-Infinity);
        }}
        className={styles.dockContainer}
      >
        <motion.div
          className={styles.dockBackground}
          style={{
            left: leftSpring,
            right: rightSpring,
          }}
        />

        {data.map((item) => (
          <TechIcon
            key={item.id}
            mouseLeft={mouseLeft}
            label={item.name}
            icon={item.icon}
            description={t(item.description)}
          />
        ))}
      </motion.div>

      {/* Mobile Tech Stack */}

      <div className={styles.mobileContainer}>
        <div className={styles.mobileGrid}>
          {data.map((item) => (
            <div
              key={item.id}
              className={styles.mobileIconWrapper}
            >
              <img
                src={item.icon}
                alt={item.name}
                className={styles.mobileIcon}
              />

              <div className={styles.mobileLabel}>{item.name}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function TechIcon({ mouseLeft, label, icon, description }) {
  const ref = useRef(null);

  const distance = useTransform(() => {
    const bounds = ref.current
      ? {
          x: ref.current.offsetLeft,
          width: ref.current.offsetWidth,
        }
      : {
          x: 0,
          width: 0,
        };

    return mouseLeft.get() - bounds.x - bounds.width / 2;
  });

  const scale = useTransform(distance, [-DISTANCE, 0, DISTANCE], [1, SCALE, 1]);

  const x = useTransform(() => {
    const d = distance.get();

    if (d === -Infinity) {
      return 0;
    }

    if (d < -DISTANCE || d > DISTANCE) {
      return Math.sign(d) * -1 * NUDGE;
    }

    return (-d / DISTANCE) * NUDGE * scale.get();
  });

  const scaleSpring = useSpring(scale, SPRING);
  const xSpring = useSpring(x, SPRING);
  const y = useMotionValue(0);

  return (
    <motion.div
      ref={ref}
      style={{
        x: xSpring,
        scale: scaleSpring,
        y,
      }}
      onClick={() => {
        animate(y, [0, -40, 0], {
          repeat: 2,
          ease: [
            [0, 0, 0.2, 1],
            [0.8, 0, 1, 1],
          ],
          duration: 0.7,
        });
      }}
      className={styles.appIconWrapper}
      title={label}
    >
      <div className={styles.appIcon}>
        <img
          src={icon}
          alt={label}
          className={styles.iconImage}
        />
      </div>

      <div className={styles.iconLabel}>{label}</div>

      <div className={styles.iconDescription}>{description}</div>
    </motion.div>
  );
}
