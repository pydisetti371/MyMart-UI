import { useState, type FormEvent } from "react";
import { useAuth } from "./AuthProvider";
import { accountExists, PASSWORD_PATTERN, PHONE_PATTERN } from "./auth";

type AuthMode = "signin" | "signup";

export function AuthScreen() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSignup = mode === "signup";

  const changeMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setShowPassword(false);
    setMessage("");
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      if (isSignup) {
        await signUp(name, phone, password);
      } else {
        await signIn(phone, password);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unable to continue. Try again.";
      setMessage(errorMessage);
      if (isSignup && errorMessage.includes("already uses this phone number")) {
        setMode("signin");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-stage">
      <section aria-labelledby="auth-title" className="auth-card">
        <div aria-hidden="true" className="auth-mark">
          <svg fill="none" viewBox="0 0 24 24">
            <path
              d="M3 4h2l2.1 10.1a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 1.9-1.4L22 8H7"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
            <path
              d="M10 20h.01M18 20h.01M9 11l2 2 4-4"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        </div>
        <p className="auth-eyebrow">VMART STORE PORTAL</p>
        <h1 id="auth-title">
          {isSignup ? "Create your account" : "Welcome back"}
        </h1>
        <p className="auth-subtitle">
          {isSignup
            ? "Set up your account to continue to VMart."
            : "Sign in with your phone number to continue."}
        </p>

        <div aria-label="Account access" className="auth-tabs" role="tablist">
          <button
            aria-selected={!isSignup}
            className={!isSignup ? "active" : ""}
            onClick={() => changeMode("signin")}
            role="tab"
            type="button"
          >
            Sign in
          </button>
          <button
            aria-selected={isSignup}
            className={isSignup ? "active" : ""}
            onClick={() => changeMode("signup")}
            role="tab"
            type="button"
          >
            Sign up
          </button>
        </div>

        <form className="auth-form" onSubmit={submit}>
          {isSignup && (
            <label className="auth-field">
              <span>Full name <b aria-hidden="true">*</b></span>
              <input
                autoComplete="name"
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter your name"
                required
                type="text"
                value={name}
              />
            </label>
          )}

          <label className="auth-field">
            <span>Phone number <b aria-hidden="true">*</b></span>
            <span className="auth-phone-input">
              <span aria-hidden="true" className="auth-country-code">
                +91
              </span>
              <input
                autoComplete="tel-national"
                inputMode="numeric"
                maxLength={10}
                onBlur={() => {
                  if (isSignup && PHONE_PATTERN.test(phone) && accountExists(phone)) {
                    setMode("signin");
                    setMessage(
                      "This phone number is already registered. Please sign in.",
                    );
                  }
                }}
                onChange={(event) => {
                  setPhone(event.target.value.replace(/\D/g, "").slice(0, 10));
                  setMessage("");
                }}
                pattern="[0-9]{10}"
                placeholder="10-digit phone number"
                required
                title="Enter exactly 10 digits."
                type="tel"
                value={phone}
              />
            </span>
            <small>Enter exactly 10 digits.</small>
          </label>

          <div className="auth-field">
            <label htmlFor="auth-password">
              Password <b aria-hidden="true">*</b>
            </label>
            <div className="auth-password-control">
              <input
                autoComplete={isSignup ? "new-password" : "current-password"}
                id="auth-password"
                minLength={isSignup ? 8 : undefined}
                onChange={(event) => setPassword(event.target.value)}
                pattern={isSignup ? PASSWORD_PATTERN.source : undefined}
                placeholder={isSignup ? "Create a strong password" : "Enter your password"}
                required
                title={
                  isSignup
                    ? "Use 8+ characters with uppercase, lowercase, a number, and a symbol."
                    : undefined
                }
                type={showPassword ? "text" : "password"}
                value={password}
              />
              <button
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="password-visibility-button"
                onClick={() => setShowPassword((visible) => !visible)}
                title={showPassword ? "Hide password" : "Show password"}
                type="button"
              >
                {showPassword ? (
                  <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
                    <path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                    <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c6.4 0 10 7 10 7a15 15 0 0 1-3.2 3.9M6.2 6.2C3.5 8 2 12 2 12s3.6 7 10 7a10 10 0 0 0 4-.8" />
                  </svg>
                ) : (
                  <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
                    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {isSignup && (
              <small>
                Use 8 or more characters with uppercase and lowercase letters,
                a number, and a symbol. Do not use spaces.
              </small>
            )}
          </div>

          {message && (
            <p aria-live="polite" className="auth-message" role="alert">
              {message}
            </p>
          )}

          <button className="auth-submit" disabled={isSubmitting} type="submit">
            {isSubmitting
              ? "Please wait…"
              : isSignup
                ? "Create account"
                : "Sign in"}
          </button>
        </form>

        <p className="auth-switch">
          {isSignup ? "Already have an account?" : "New to VMart?"}{" "}
          <button
            onClick={() => changeMode(isSignup ? "signin" : "signup")}
            type="button"
          >
            {isSignup ? "Sign in" : "Sign up"}
          </button>
        </p>
      </section>
    </main>
  );
}
