import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";

import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create account — FutureReady" },
      {
        name: "description",
        content: "Create your FutureReady account and start building career readiness.",
      },
      { property: "og:title", content: "Create account — FutureReady" },
      {
        property: "og:description",
        content: "Start your resume, interview prep and job matching journey.",
      },
    ],
  }),
  component: RegisterPage,
});

interface Errors {
  name?: string;
  email?: string;
  password?: string;
  confirm?: string;
  form?: string;
}

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [show, setShow] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const set = (key: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  const validate = () => {
    const next: Errors = {};
    if (values.name.trim().length < 2) next.name = "Enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(values.email)) next.email = "Enter a valid email address.";
    if (values.password.length < 8) next.password = "Use at least 8 characters.";
    if (values.password !== values.confirm) next.confirm = "Passwords do not match.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await register({ name: values.name, email: values.email, password: values.password });
      void navigate({ to: "/onboarding" });
    } catch (error) {
      setErrors({ form: error instanceof Error ? error.message : "Registration failed." });
    } finally {
      setSubmitting(false);
    }
  };

  const fields: { key: keyof typeof values; label: string; type: string; autoComplete: string }[] = [
    { key: "name", label: "Full name", type: "text", autoComplete: "name" },
    { key: "email", label: "Email", type: "email", autoComplete: "email" },
  ];

  return (
    <AuthLayout
      title="Create your account"
      description="Set up your profile, then we'll map your career readiness."
    >
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        {errors.form ? (
          <p role="alert" className="rounded-md bg-danger-soft px-3 py-2 text-sm text-destructive">
            {errors.form}
          </p>
        ) : null}

        {fields.map((field) => (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={field.key}>{field.label}</Label>
            <Input
              id={field.key}
              type={field.type}
              autoComplete={field.autoComplete}
              value={values[field.key]}
              onChange={set(field.key)}
              aria-invalid={Boolean(errors[field.key])}
              aria-describedby={errors[field.key] ? `${field.key}-error` : undefined}
            />
            {errors[field.key] ? (
              <p id={`${field.key}-error`} className="text-xs text-destructive">
                {errors[field.key]}
              </p>
            ) : null}
          </div>
        ))}

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={show ? "text" : "password"}
              autoComplete="new-password"
              value={values.password}
              onChange={set("password")}
              aria-invalid={Boolean(errors.password)}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground"
              aria-label={show ? "Hide password" : "Show password"}
            >
              {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.password ? <p className="text-xs text-destructive">{errors.password}</p> : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm">Confirm password</Label>
          <Input
            id="confirm"
            type={show ? "text" : "password"}
            autoComplete="new-password"
            value={values.confirm}
            onChange={set("confirm")}
            aria-invalid={Boolean(errors.confirm)}
          />
          {errors.confirm ? <p className="text-xs text-destructive">{errors.confirm}</p> : null}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={submitting || !values.name || !values.email || !values.password}
        >
          {submitting ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
          {submitting ? "Creating account…" : "Create account"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already registered?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
