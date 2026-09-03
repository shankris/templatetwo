"use client";

import styles from "./Select.module.css";
import data from "./data.json";

/* --------------------------------------------------
   Select Component
-------------------------------------------------- */

export default function Select({ field = data.fields[0], value, onChange, onBlur }) {
  const { id, label, placeholder = "Select an option", required = false, variant = "vertical", width, options = [] } = field;

  const select = (
    <select
      id={id}
      name={id}
      {...(onChange ? { value: value ?? "", onChange } : { defaultValue: value ?? "" })}
      required={required}
      onBlur={onBlur}
    >
      <option
        value=''
        disabled
      >
        {placeholder}
      </option>

      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
        >
          {option.label}
        </option>
      ))}
    </select>
  );

  return (
    <div
      className={`${styles.field} ${styles[variant]}`}
      style={{ "--select-width": width }}
    >
      <label htmlFor={id}>
        {label}
        {required && <span className={styles.required}>*</span>}
      </label>

      {select}
    </div>
  );
}
