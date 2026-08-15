import { Link, createFileRoute } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";

import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset password — FutureReady" },
      { name: "description", content: "Request a password reset link for your FutureReady account." },
      { property: "og:title", content: "Reset password — FutureReady" },
      { property: "og:description", content: "Request a FutureReady password reset link." },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "sent" | "error">("idle");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setState("error");
      return;
    }
    setState("loading");
    await new Promise((r) => setTimeout(r, 600));
    setState("sent");
  };

  return (
    <AuthLayout
      title="Reset your password"
      description="We'll send a reset link once the backend auth service is connected."
    >
      {state === "sent" ? (
        <div className="space-y-4">
          <p className="rounded-md bg-success-soft px-3 py-2 text-sm text-success">
            Request recorded for {email}. Delivery happens once the FastAPI auth service is
            connected — no email has been sent yet.
          </p>
          <Button asChild variant="outline" className="w-full">
            <Link to="/login">Back to sign in</Link>
          </Button>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={state === "error"}
            />
            {state === "error" ? (
              <p className="text-xs text-destructive">Enter a valid email address.</p>
            ) : null}
          </div>
          <Button type="submit" className="w-full" disabled={state === "loading" || !email}>
            {state === "loading" ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
            Send reset link
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            <Link to="/login" className="font-medium text-primary hover:underline">
              Back to sign in
            </Link>
          </p>
        </form>
      )}
    </AuthLayout>
  );
}
