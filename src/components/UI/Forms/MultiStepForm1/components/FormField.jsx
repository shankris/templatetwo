"use client";
import styles from "./FormField.module.css";
import DatePickerNative from "@/components/UI/DatePickers/DatePickerNative/DatePickerNative";

export default function FormField({ field, value, onChange, onBlur, error }) {
  const commonProps = {
    id: field.id,
    name: field.id,
    value: value ?? "",
    onChange: (event) => onChange(field.id, event.target.value),
    onBlur: () => onBlur(field.id),
  };

  if (field.type === "textarea") {
    return (
      <div>
        <label htmlFor={field.id}>
          {field.label}
          {field.required && <span>*</span>}
        </label>

        <textarea
          {...commonProps}
          placeholder={field.placeholder}
        />

        {error && <p className={styles.error}>{error.message}</p>}
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <div>
        <label htmlFor={field.id}>
          {field.label}
          {field.required && <span>*</span>}
        </label>

        <select {...commonProps}>
          <option value=''>Select an option</option>

          {field.options?.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>

        {error && <p className={styles.error}>{error.message}</p>}
      </div>
    );
  }

  if (field.type === "radio") {
    return (
      <fieldset>
        <legend>
          {field.label}
          {field.required && <span>*</span>}
        </legend>

        <div>
          {field.options?.map((option) => (
            <label key={option.value}>
              <input
                type='radio'
                name={field.id}
                value={option.value}
                checked={value === option.value}
                onChange={() => onChange(field.id, option.value)}
                onBlur={() => onBlur(field.id)}
              />

              <span>{option.label}</span>
            </label>
          ))}
        </div>

        {error && <p className={styles.error}>{error.message}</p>}
      </fieldset>
    );
  }

  if (field.type === "date") {
    return (
      <div>
        <label htmlFor={field.id}>
          {field.label}
          {field.required && <span>*</span>}
        </label>

        <DatePickerNative
          value={value}
          onChange={(newValue) => onChange(field.id, newValue)}
          onBlur={() => onBlur(field.id)}
          locale={field.locale}
          validation={field.validation}
          placeholder={field.placeholder}
          datePicker={field.datePicker}
        />

        {error && <p className={styles.error}>{error.message}</p>}
      </div>
    );
  }

  return (
    <div>
      <label htmlFor={field.id}>
        {field.label}
        {field.required && <span>*</span>}
      </label>

      <input
        {...commonProps}
        type={field.type}
        placeholder={field.placeholder}
      />

      {error && <p className={styles.error}>{error.message}</p>}
    </div>
  );
}
