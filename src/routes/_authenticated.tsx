import { Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
});

/**
 * Client-side route protection. Once FastAPI sessions are wired up, replace the
 * localStorage session flag in authService with a `GET /auth/me` check here.
 */
function AuthenticatedLayout() {
  const { status } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (status === "anonymous") {
      void navigate({ to: "/login", replace: true });
    }
  }, [status, navigate]);

  if (status !== "authenticated") {
    return (
      <div className="min-h-screen space-y-4 p-6" aria-busy="true">
        <Skeleton className="h-16 w-full rounded-lg" />
        <Skeleton className="h-64 w-full rounded-lg" />
        <span className="sr-only">Checking your session</span>
      </div>
    );
  }

  return <Outlet />;
}
