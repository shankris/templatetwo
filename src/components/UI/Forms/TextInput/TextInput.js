"use client";

import Field from "../shared/Field/Field";
import styles from "./TextInput.module.css";
import data from "./data.json";

/* --------------------------------------------------
   TextInput Component
-------------------------------------------------- */

export default function TextInput({ field = data.fields[0], value, onChange, onBlur, variant = "vertical", width = "100%" }) {
  const { id, label, type = "text", placeholder = "", required = false, helperText, helpText } = field;

  return (
    <Field
      id={id}
      label={label}
      required={required}
      helperText={helperText}
      helpText={helpText}
      variant={variant}
      width={width}
    >
      <input
        id={id}
        name={id}
        type={type}
        {...(onChange
          ? {
              value: value ?? "",
              onChange,
            }
          : {
              defaultValue: value ?? "",
            })}
        placeholder={variant === "floating" ? " " : placeholder}
        required={required}
        onBlur={onBlur}
        className={styles.input}
      />
    </Field>
  );
}
