import { createFileRoute } from "@tanstack/react-router";

import { CategoryWorkspace } from "@/components/interview/CategoryWorkspace";

export const Route = createFileRoute("/_authenticated/interview/project")({
  head: () => ({
    meta: [
      { title: "Project Round Practice — FutureReady" },
      { name: "description", content: "Architecture and deep-dive questions about your own projects." },
      { property: "og:title", content: "Project Round Practice — FutureReady" },
      { property: "og:description", content: "Defend your project decisions with structured practice." },
    ],
  }),
  component: ProjectPage,
});

function ProjectPage() {
  return (
    <CategoryWorkspace
      category="project"
      title="Project round"
      description="Questions generated from the projects recorded in your profile and resume."
    />
  );
}
