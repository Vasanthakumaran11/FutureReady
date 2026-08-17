import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";

export function LoginPage() {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  // Initialize Google Identity Services if client ID is provided
  useEffect(() => {
    if (!googleClientId) return;

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: async (response) => {
            if (response.credential) {
              try {
                setGoogleSubmitting(true);
                await loginWithGoogle({ credential: response.credential });
                navigate("/dashboard");
              } catch (err) {
                setErrors({ form: err instanceof Error ? err.message : "Google sign-in failed." });
              } finally {
                setGoogleSubmitting(false);
              }
            }
          },
        });

        const targetDiv = document.getElementById("google-signin-render");
        if (targetDiv) {
          window.google.accounts.id.renderButton(targetDiv, {
            theme: "outline",
            size: "large",
            width: "100%",
            text: "signin_with",
            shape: "rectangular",
          });
        }
      }
    };
    document.body.appendChild(script);

    return () => {
      try {
        document.body.removeChild(script);
      } catch {
        // ignore
      }
    };
  }, [googleClientId, loginWithGoogle, navigate]);

  const handleGoogleClick = async () => {
    if (window.google?.accounts?.id && googleClientId) {
      window.google.accounts.id.prompt();
      return;
    }

    // Interactive prompt for demo / custom Google email if client ID is not yet placed in .env
    const userEmail = prompt("Enter your Google Account email to Sign In with Google:");
    if (!userEmail || !userEmail.trim()) return;

    const userName = prompt("Enter your Name for the Google Account:") || userEmail.split("@")[0];

    try {
      setGoogleSubmitting(true);
      await loginWithGoogle({
        email: userEmail.trim(),
        name: userName.trim(),
        picture: "https://lh3.googleusercontent.com/a/default-user=s96-c",
      });
      navigate("/dashboard");
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : "Google sign-in failed." });
    } finally {
      setGoogleSubmitting(false);
    }
  };

  const validate = () => {
    const next = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email address.";
    if (password.length < 8) next.password = "Password must be at least 8 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await login({ email, password });
      navigate("/dashboard");
    } catch (error) {
      setErrors({ form: error instanceof Error ? error.message : "Sign in failed." });
    } finally {
      setSubmitting(false);
    }
  };

  const disabled = submitting || !email || !password;

  return (
    <AuthLayout title="Sign in" description="Continue your career readiness journey.">
      <div className="space-y-5">
        {errors.form ? (
          <p
            role="alert"
            className="rounded-lg bg-danger-soft px-3.5 py-2.5 text-sm font-medium text-destructive border border-destructive/20"
          >
            {errors.form}
          </p>
        ) : null}

        {/* GOOGLE SIGN IN BUTTON */}
        <div className="space-y-3">
          <div id="google-signin-render" className="w-full min-h-[40px] flex justify-center">
            <button
              type="button"
              onClick={handleGoogleClick}
              disabled={googleSubmitting || submitting}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all shadow-sm active:scale-[0.99] cursor-pointer"
            >
              {googleSubmitting ? (
                <Loader2 className="size-4 animate-spin text-neutral-600 dark:text-neutral-400" />
              ) : (
                <svg className="size-4.5" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              <span>{googleSubmitting ? "Connecting to Google…" : "Sign in with Google"}</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-border w-full" />
            <span className="font-bold ">OR</span>
            <div className="border-t border-border w-full" />
          </div>
        </div>

        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-semibold text-foreground">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email ? (
              <p id="email-error" className="text-xs text-destructive font-medium">
                {errors.email}
              </p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-semibold text-foreground">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? "password-error" : undefined}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {errors.password ? (
              <p id="password-error" className="text-xs text-destructive font-medium">
                {errors.password}
              </p>
            ) : null}
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
              <Checkbox id="remember" /> Remember me
            </label>
            <Link to="/forgot-password" className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">
            Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md shadow-blue-600/25"
            disabled={disabled}
          >
            {submitting ? <Loader2 className="size-4 animate-spin mr-2" aria-hidden /> : null}
            {submitting ? "Signing in…" : "Sign in"}
          </Button>

          <p className="text-center text-sm text-muted-foreground pt-1">
            New to FutureReady?{" "}
            <Link to="/register" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}
