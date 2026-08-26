"use client";

import { useState } from "react";
import styles from "./Login01.module.css";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    ```
setLoading(true);

// Replace this with your real authentication logic.
await new Promise((resolve) => setTimeout(resolve, 2000));

setLoading(false);
setEmail("");
setPassword("");
```;
  }

  return (
    <div className={styles.wrapper}>
      {" "}
      <div className={styles.container}>
        {" "}
        <div className={styles.loginHeader}>
          {" "}
          <h1 className={styles.brandTitle}>Welcome Back</h1> <p className={styles.brandSubtitle}>Sign in to continue to your account </p>{" "}
        </div>
        ```
        <form
          className={styles.loginForm}
          onSubmit={handleSubmit}
        >
          <div className={styles.formGroup}>
            <label
              htmlFor='email'
              className={styles.formLabel}
            >
              Email Address
            </label>

            <input
              type='email'
              id='email'
              className={styles.formInput}
              placeholder='name@company.com'
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <div className={styles.labelRow}>
              <label
                htmlFor='password'
                className={styles.formLabel}
              >
                Password
              </label>

              <a
                href='#'
                className={styles.forgotLink}
              >
                Forgot password?
              </a>
            </div>

            <input
              type='password'
              id='password'
              className={styles.formInput}
              placeholder='Enter your password'
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type='checkbox'
                className={styles.checkboxInput}
                checked={remember}
                onChange={(event) => setRemember(event.target.checked)}
              />

              <span className={styles.checkboxText}>Remember me for 30 days</span>
            </label>
          </div>

          <button
            type='submit'
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? <span className={styles.loader} /> : <span>Sign In</span>}
          </button>
        </form>
        <div className={styles.divider}>
          <span className={styles.dividerText}>or continue with</span>
        </div>
        <div className={styles.socialButtons}>
          <button
            type='button'
            className={styles.socialButton}
          >
            <span className={styles.socialIcon}>G</span>
            Google
          </button>

          <button
            type='button'
            className={styles.socialButton}
          >
            <span className={styles.socialIcon}>⌘</span>
            GitHub
          </button>
        </div>
        <p className={styles.signupText}>
          Don't have an account?{" "}
          <a
            href='#'
            className={styles.signupLink}
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
