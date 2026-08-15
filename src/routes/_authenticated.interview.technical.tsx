import { createFileRoute } from "@tanstack/react-router";

import { CategoryWorkspace } from "@/components/interview/CategoryWorkspace";

export const Route = createFileRoute("/_authenticated/interview/technical")({
  head: () => ({
    meta: [
      { title: "Technical Round Practice — FutureReady" },
      { name: "description", content: "Concept questions for your stack with attempt status and feedback." },
      { property: "og:title", content: "Technical Round Practice — FutureReady" },
      { property: "og:description", content: "Practice technical interview questions with feedback." },
    ],
  }),
  component: TechnicalPage,
});

function TechnicalPage() {
  return (
    <CategoryWorkspace
      category="technical"
      title="Technical round"
      description="Concept questions drawn from your stack, target role and company patterns."
    />
  );
}
