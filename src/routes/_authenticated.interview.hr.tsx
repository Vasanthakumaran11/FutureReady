import { createFileRoute } from "@tanstack/react-router";

import { CategoryWorkspace } from "@/components/interview/CategoryWorkspace";

export const Route = createFileRoute("/_authenticated/interview/hr")({
  head: () => ({
    meta: [
      { title: "HR Round Practice — FutureReady" },
      { name: "description", content: "Behavioural questions, communication practice, answer history and feedback." },
      { property: "og:title", content: "HR Round Practice — FutureReady" },
      { property: "og:description", content: "Practice behavioural answers with structured feedback." },
    ],
  }),
  component: HrPage,
});

function HrPage() {
  return (
    <CategoryWorkspace
      category="hr"
      title="HR round"
      description="Behavioural and communication practice using the STAR structure."
    />
  );
}
