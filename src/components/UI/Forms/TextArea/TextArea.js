"use client";

import styles from "./TextArea.module.css";
import data from "./data.json";

/* --------------------------------------------------
   TextArea Component
-------------------------------------------------- */

export default function TextArea({ field = data.fields[0], value, onChange, onBlur }) {
  const { id, label, placeholder = "", required = false, variant = "vertical", width, rows = 4 } = field;

  const textarea = (
    <textarea
      id={id}
      name={id}
      rows={rows}
      {...(onChange ? { value: value ?? "", onChange } : { defaultValue: value ?? "" })}
      placeholder={placeholder}
      required={required}
      onBlur={onBlur}
    />
  );

  return (
    <div
      className={`${styles.field} ${styles[variant]}`}
      style={{ "--textarea-width": width }}
    >
      <label htmlFor={id}>
        {label}
        {required && <span className={styles.required}>*</span>}
      </label>

      {textarea}
    </div>
  );
}
