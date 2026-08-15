import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";

import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — FutureReady" },
      { name: "description", content: "Sign in to your FutureReady career readiness workspace." },
      { property: "og:title", content: "Sign in — FutureReady" },
      { property: "og:description", content: "Access your resume, interview prep and job matches." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const next: typeof errors = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email address.";
    if (password.length < 8) next.password = "Password must be at least 8 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await login({ email, password });
      void navigate({ to: "/dashboard" });
    } catch (error) {
      setErrors({ form: error instanceof Error ? error.message : "Sign in failed." });
    } finally {
      setSubmitting(false);
    }
  };

  const disabled = submitting || !email || !password;

  return (
    <AuthLayout title="Sign in" description="Continue your career readiness journey.">
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        {errors.form ? (
          <p role="alert" className="rounded-md bg-danger-soft px-3 py-2 text-sm text-destructive">
            {errors.form}
          </p>
        ) : null}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
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
            <p id="email-error" className="text-xs text-destructive">
              {errors.email}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
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
              className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.password ? (
            <p id="password-error" className="text-xs text-destructive">
              {errors.password}
            </p>
          ) : null}
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <Checkbox id="remember" /> Remember me
          </label>
          <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-full" disabled={disabled}>
          {submitting ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
          {submitting ? "Signing in…" : "Sign in"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          New to FutureReady?{" "}
          <Link to="/register" className="font-medium text-primary hover:underline">
            Create an account
          </Link>
        </p>
        <p className="text-center text-xs text-muted-foreground">
          Authentication is a frontend abstraction only — it will connect to the FastAPI auth
          service.
        </p>
      </form>
    </AuthLayout>
  );
}
