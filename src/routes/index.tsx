import { createFileRoute, redirect } from "@tanstack/react-router";

/** The product entry point is the dashboard; "/" always forwards there. */
export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/dashboard" });
  },
  component: () => null,
});
