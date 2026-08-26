"use client";

import { useMemo, useState } from "react";

import formConfig from "./student-admission.json";
import FormProgress from "./components/FormProgress";
import FormField from "./components/FormField";
import validateField from "./validation/validateField";

import styles from "./MultiStepForm1.module.css";

export default function MultiStepForm1() {
  const config = formConfig;

  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState({});
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});

  const section = config.sections[currentSection];

  const isFirstSection = currentSection === 0;

  const isLastSection = currentSection === config.sections.length - 1;

  const handleChange = (fieldId, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));

    if (!touched[fieldId]) {
      return;
    }

    const field = section.fields.find((item) => item.id === fieldId);

    if (!field) return;

    const result = validateField(field, value);

    setErrors((prev) => {
      const next = { ...prev };

      if (!result.valid) {
        next[fieldId] = result;
      } else {
        delete next[fieldId];
      }

      return next;
    });
  };

  const handleBlur = (fieldId) => {
    const field = section.fields.find((item) => item.id === fieldId);

    if (!field) return;

    const value = formData[fieldId];

    const result = validateField(field, value);

    setTouched((prev) => ({
      ...prev,
      [fieldId]: true,
    }));

    setErrors((prev) => {
      const next = { ...prev };

      if (!result.valid) {
        next[fieldId] = result;
      } else {
        delete next[fieldId];
      }

      return next;
    });
  };

  const handlePrevious = () => {
    if (!isFirstSection) {
      setCurrentSection((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (!isLastSection) {
      setCurrentSection((prev) => prev + 1);
    }
  };

  const hasData = useMemo(
    () =>
      Object.values(formData).some((value) => {
        if (Array.isArray(value)) {
          return value.length > 0;
        }

        return value !== undefined && value !== null && value !== "";
      }),
    [formData],
  );

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className={styles.form}>
      <header className={styles.header}>
        <div>
          <h1>{config.title}</h1>

          {config.description && <p>{config.description}</p>}
        </div>
      </header>

      <div className={styles.body}>
        <aside className={styles.sidebar}>
          <div className={styles.overallProgress}>
            <FormProgress percentage={0} />
          </div>

          <nav>
            {config.sections.map((item, index) => (
              <button
                key={item.id}
                type='button'
                className={index === currentSection ? styles.activeSection : ""}
                onClick={() => setCurrentSection(index)}
              >
                <span>{index + 1}</span>

                {item.title}

                {Object.keys(errors).some((errorId) => item.fields.some((field) => field.id === errorId)) && <span className={styles.sectionError}>*</span>}
              </button>
            ))}
          </nav>
        </aside>

        <main className={styles.content}>
          <section>
            <h2>{section.title}</h2>

            {section.description && <p>{section.description}</p>}

            <div className={styles.fields}>
              {section.fields.map((field) => (
                <FormField
                  key={field.id}
                  field={field}
                  value={formData[field.id]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors[field.id]}
                />
              ))}
            </div>
          </section>

          <footer className={styles.footer}>
            <button
              type='button'
              onClick={handlePrevious}
              disabled={isFirstSection}
            >
              {config.navigation.previous}
            </button>

            <div>
              <button
                type='button'
                disabled={!hasData}
              >
                {config.navigation.save}
              </button>

              {!isLastSection ? (
                <button
                  type='button'
                  onClick={handleNext}
                >
                  {config.navigation.next}
                </button>
              ) : (
                <button
                  type='button'
                  disabled={hasErrors}
                >
                  {config.navigation.submit}
                </button>
              )}
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
