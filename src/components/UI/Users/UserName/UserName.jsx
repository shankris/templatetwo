"use client";

import { getUserNameParts } from "@/utils/user/userUtils";

import styles from "./UserName.module.css";

/* --------------------------------------------------
   UserName Component

   Displays a user's name with the last name
   visually differentiated.

   Props:
   - name
   - firstNameOnly
   - lastNameOnly
   - twoLines
-------------------------------------------------- */

export default function UserName({ name = "", firstNameOnly = false, lastNameOnly = false, twoLines = false }) {
  const { firstName, lastName } = getUserNameParts(name);

  /* --------------------------------------------------
     First Name Only
  -------------------------------------------------- */

  if (firstNameOnly) {
    return <span className={styles.name}>{firstName}</span>;
  }

  /* --------------------------------------------------
     Last Name Only
  -------------------------------------------------- */

  if (lastNameOnly) {
    return <span className={styles.lastName}>{lastName.toUpperCase()}</span>;
  }

  /* --------------------------------------------------
     Two-Line Name
  -------------------------------------------------- */

  if (twoLines && lastName) {
    return (
      <span className={styles.twoLineName}>
        <span className={styles.firstName}>{firstName}</span>

        <span className={styles.lastName}>{lastName.toUpperCase()}</span>
      </span>
    );
  }

  /* --------------------------------------------------
     Default Single-Line Name
  -------------------------------------------------- */

  return (
    <span className={styles.name}>
      <span>{firstName}</span>

      {lastName && (
        <>
          {" "}
          <span className={styles.lastName}>{lastName.toUpperCase()}</span>
        </>
      )}
    </span>
  );
}
