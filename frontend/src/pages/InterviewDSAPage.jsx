import { JourneyStrip } from "@/components/common/JourneyStrip";
import { ProgressBar, StatusBadge } from "@/components/common/indicators";
import { PageHeader, SectionCard } from "@/components/common/page";
import { ErrorState, RowsSkeleton } from "@/components/common/states";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { useAsyncData } from "@/hooks/useAsyncData";
import { interviewService } from "@/services/interview/interviewService";

export function InterviewDSAPage() {
  const { data, loading, error, reload } = useAsyncData(() => interviewService.getDsaTopics());

  return (
    <AppShell title="DSA practice">
      <PageHeader
        title="DSA practice"
        description="Topics are ordered by how much they affect your readiness for the selected role."
        actions={<Button onClick={() => void reload()}>Generate practice set</Button>}
      />

      {error ? <ErrorState message={error} onRetry={reload} /> : null}
      {loading && !data ? <RowsSkeleton count={4} /> : null}

      {data ? (
        <SectionCard bodyClassName="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-180 text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  {["Topic", "Difficulty", "Completed", "Accuracy", "Progress"].map((h) => (
                    <th key={h} className="px-5 py-3 text-eyebrow text-tertiary">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((t) => (
                  <tr
                    key={t.id}
                    className="border-b border-border transition-colors duration-150 hover:bg-surface-hover last:border-0"
                  >
                    <td className="px-5 py-3 font-medium text-foreground">{t.topic}</td>
                    <td className="px-5 py-3">
                      <StatusBadge
                        tone={
                          t.difficulty === "Hard"
                            ? "danger"
                            : t.difficulty === "Medium"
                              ? "warning"
                              : "success"
                        }
                      >
                        {t.difficulty}
                      </StatusBadge>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {t.solved} / {t.total}
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{t.accuracy}%</td>
                    <td className="w-56 px-5 py-3">
                      <ProgressBar
                        value={(t.solved / t.total) * 100}
                        tone={t.solved / t.total > 0.6 ? "success" : "warning"}
                        label={`${t.topic} progress`}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      ) : null}
    </AppShell>
  );
}
