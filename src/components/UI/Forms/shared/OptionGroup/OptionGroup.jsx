"use client";

import { useState } from "react";
import styles from "./OptionGroup.module.css";

/* --------------------------------------------------
   Option Group
-------------------------------------------------- */

export default function OptionGroup({ field, value, onChange, onBlur, type = "radio" }) {
  const { id, label, required = false, variant = "vertical", width, options = [] } = field;

  const [internalValue, setInternalValue] = useState(type === "checkbox" ? [] : "");

  const [ripple, setRipple] = useState(null);

  const selectedValue = onChange ? value : internalValue;

  /* --------------------------------------------------
     Check whether an option is selected
  -------------------------------------------------- */

  const isSelected = (optionValue) => {
    if (type === "checkbox") {
      return Array.isArray(selectedValue) ? selectedValue.includes(optionValue) : false;
    }

    return selectedValue === optionValue;
  };

  /* --------------------------------------------------
     Handle native input change
  -------------------------------------------------- */

  const handleChange = (optionValue) => {
    let newValue;

    if (type === "checkbox") {
      const currentValues = Array.isArray(selectedValue) ? selectedValue : [];

      newValue = currentValues.includes(optionValue) ? currentValues.filter((item) => item !== optionValue) : [...currentValues, optionValue];
    } else {
      newValue = optionValue;
    }

    if (onChange) {
      onChange({
        target: {
          name: id,
          value: newValue,
        },
      });
    } else {
      setInternalValue(newValue);
    }
  };

  /* --------------------------------------------------
     Create ripple from click position
  -------------------------------------------------- */

  const handleClick = (event, optionValue) => {
    const rect = event.currentTarget.getBoundingClientRect();

    setRipple({
      option: optionValue,
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      id: Date.now(),
    });
  };

  return (
    <div
      className={`${styles.field} ${styles[variant]}`}
      style={{ "--option-width": width }}
    >
      <div className={styles.label}>
        {label}
        {required && <span className={styles.required}>*</span>}
      </div>

      <div className={styles.options}>
        {options.map((option) => {
          const selected = isSelected(option.value);

          return (
            <label
              key={option.value}
              className={`${styles.option} ${selected ? styles.selected : ""}`}
              onClick={(event) => handleClick(event, option.value)}
            >
              {ripple?.option === option.value && (
                <span
                  key={ripple.id}
                  className={styles.ripple}
                  style={{
                    "--ripple-x": `${ripple.x}px`,
                    "--ripple-y": `${ripple.y}px`,
                  }}
                />
              )}

              <input
                type={type}
                name={id}
                value={option.value}
                checked={selected}
                onChange={() => handleChange(option.value)}
                onBlur={onBlur}
              />

              <span className={styles.optionContent}>
                <span className={styles.optionTitle}>{option.label}</span>

                {option.description && <span className={styles.optionDescription}>{option.description}</span>}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
