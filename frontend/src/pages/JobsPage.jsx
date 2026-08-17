import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Briefcase, Compass, Search, Sparkles, MapPin, RefreshCw, Loader2, Plus } from "lucide-react";

import { JobCard } from "@/components/common/JobCard";
import { PageHeader, SectionCard } from "@/components/common/page";
import { CardsSkeleton, EmptyState, ErrorState } from "@/components/common/states";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { jobService } from "@/services/jobs/jobService";
import emptyJobs from "@/assets/illustrations/empty-jobs.jpg";

export function JobsPage() {
  const [tab, setTab] = useState("recommended"); // "recommended" | "search"
  const [q, setQ] = useState("");
  const [location, setLocation] = useState("");
  const [appliedSearch, setAppliedSearch] = useState({ q: "", location: "" });

  // Recommended Jobs State
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [recProfileSummary, setRecProfileSummary] = useState(null);
  const [recLoading, setRecLoading] = useState(false);
  const [recError, setRecError] = useState(null);
  const [recLimit, setRecLimit] = useState(12);
  const [recHasMore, setRecHasMore] = useState(true);

  // Search Jobs State
  const [searchJobsList, setSearchJobsList] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [searchPage, setSearchPage] = useState(1);
  const [searchHasMore, setSearchHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Fetch Recommended Jobs
  const fetchRecommendations = useCallback(async (limit = 12) => {
    setRecLoading(true);
    setRecError(null);
    try {
      const res = await jobService.getRecommendedJobs(limit);
      setRecommendedJobs(res.items || []);
      setRecProfileSummary(res.profileSummary);
      setRecHasMore((res.items || []).length >= limit);
    } catch (err) {
      setRecError(err instanceof Error ? err.message : "Failed to load recommendations");
    } finally {
      setRecLoading(false);
    }
  }, []);

  // Fetch Search Jobs (Initial or Filtered)
  const fetchSearchJobs = useCallback(async (query, loc, page = 1, append = false) => {
    if (page === 1) {
      setSearchLoading(true);
    } else {
      setLoadingMore(true);
    }
    setSearchError(null);

    try {
      const res = await jobService.searchJobs({
        q: query,
        location: loc,
        page,
        pageSize: 12,
      });

      const newItems = res.items || [];
      if (append) {
        setSearchJobsList((prev) => [...prev, ...newItems]);
      } else {
        setSearchJobsList(newItems);
      }

      setSearchHasMore(newItems.length >= 10);
      setSearchPage(page);
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : "Failed to load jobs");
    } finally {
      setSearchLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchRecommendations(12);
  }, [fetchRecommendations]);

  // When switching to Search tab for the first time
  useEffect(() => {
    if (tab === "search" && searchJobsList.length === 0 && !searchLoading) {
      fetchSearchJobs(appliedSearch.q, appliedSearch.location, 1, false);
    }
  }, [tab, searchJobsList.length, searchLoading, appliedSearch, fetchSearchJobs]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setAppliedSearch({ q, location });
    fetchSearchJobs(q, location, 1, false);
  };

  const handleLoadMore = () => {
    if (tab === "search") {
      fetchSearchJobs(appliedSearch.q, appliedSearch.location, searchPage + 1, true);
    } else {
      const nextLimit = recLimit + 8;
      setRecLimit(nextLimit);
      fetchRecommendations(nextLimit);
    }
  };

  const save = async (job) => {
    try {
      await jobService.saveJob(job);
      toast.success(`"${job.title}" saved to your Application Tracker`);
    } catch {
      toast.error("Failed to save job");
    }
  };

  const currentJobs = tab === "recommended" ? recommendedJobs : searchJobsList;
  const currentLoading = tab === "recommended" ? recLoading : searchLoading;
  const currentError = tab === "recommended" ? recError : searchError;
  const hasMore = tab === "recommended" ? recHasMore : searchHasMore;

  return (
    <AppShell title="Job Opportunities">
      <PageHeader
        title="Jobs & Opportunities"
        description="Browse opportunities from Jooble & Adzuna, ranked deterministically against your candidate skills and target role."
      />

      {/* TABS & MODE SWITCHER */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setTab("recommended")}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all cursor-pointer ${
              tab === "recommended"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-surface text-secondary hover:bg-surface-hover hover:text-foreground border border-border"
            }`}
          >
            <Sparkles className="size-4" />
            Recommended for You
          </button>
          <button
            type="button"
            onClick={() => setTab("search")}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all cursor-pointer ${
              tab === "search"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-surface text-secondary hover:bg-surface-hover hover:text-foreground border border-border"
            }`}
          >
            <Search className="size-4" />
            View All the Jobs
          </button>
        </div>

        {/* Profile Alignment Badge */}
        {tab === "recommended" && recProfileSummary ? (
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground bg-surface-hover px-3 py-1.5 rounded-lg border border-border/60">
            <Compass className="size-3.5 text-primary" />
            <span>
              Target:{" "}
              <strong className="text-foreground font-semibold">
                {recProfileSummary.target_role || "Engineering"}
              </strong>
            </span>
            {recProfileSummary.location ? (
              <span className="hidden sm:inline">
                • Location:{" "}
                <strong className="text-foreground font-semibold">
                  {recProfileSummary.location}
                </strong>
              </span>
            ) : null}
          </div>
        ) : null}
      </div>

      {/* SEARCH FILTERS SECTION (WHEN IN "VIEW ALL THE JOBS" TAB) */}
      {tab === "search" ? (
        <SectionCard title="Filter & Search Live Jobs">
          <form
            className="grid gap-3 sm:grid-cols-[1.5fr_1fr_auto] sm:items-end"
            onSubmit={handleSearchSubmit}
          >
            <div className="space-y-1.5">
              <Label htmlFor="q" className="text-xs font-semibold text-foreground">
                Role, skills, or company
              </Label>
              <div className="relative">
                <Input
                  id="q"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="e.g. Full Stack Developer, Python, React"
                  className="pl-9"
                />
                <Briefcase className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="loc" className="text-xs font-semibold text-foreground">
                Location or Remote
              </Label>
              <div className="relative">
                <Input
                  id="loc"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Bengaluru, Chennai, Remote"
                  className="pl-9"
                />
                <MapPin className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              </div>
            </div>
            <Button type="submit" className="cursor-pointer">
              <Search className="size-4 mr-1.5" /> Search Jobs
            </Button>
          </form>
        </SectionCard>
      ) : null}

      {/* SECTION HEADER & REFRESH */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div>
          {tab === "recommended" ? (
            <span>
              Showing top personalized recommendations ranked by{" "}
              <strong className="text-foreground">Profile Match %</strong>
            </span>
          ) : (
            <span>
              Showing live listings for{" "}
              <strong className="text-foreground">{appliedSearch.q || "All Engineering Roles"}</strong>
              {appliedSearch.location ? ` in ${appliedSearch.location}` : ""}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => {
            if (tab === "recommended") {
              fetchRecommendations(recLimit);
            } else {
              fetchSearchJobs(appliedSearch.q, appliedSearch.location, 1, false);
            }
          }}
          className="inline-flex items-center gap-1 text-primary hover:underline font-semibold cursor-pointer"
        >
          <RefreshCw className="size-3" /> Refresh
        </button>
      </div>

      {/* ERROR / LOADING STATES */}
      {currentError ? (
        <ErrorState
          message={currentError}
          onRetry={() => {
            if (tab === "recommended") fetchRecommendations(recLimit);
            else fetchSearchJobs(appliedSearch.q, appliedSearch.location, 1, false);
          }}
        />
      ) : null}

      {currentLoading && currentJobs.length === 0 ? <CardsSkeleton count={4} height={200} /> : null}

      {/* EMPTY STATE */}
      {!currentLoading && currentJobs.length === 0 ? (
        <EmptyState
          illustration={emptyJobs}
          title="No jobs found"
          description={
            tab === "recommended"
              ? "Update your profile with target roles and technical skills to receive tailored recommendations."
              : "Try widening your keyword search or searching across other locations."
          }
          actionLabel={tab === "recommended" ? "View All Jobs" : "Clear filters"}
          onAction={() => {
            if (tab === "recommended") {
              setTab("search");
            } else {
              setQ("");
              setLocation("");
              setAppliedSearch({ q: "", location: "" });
              fetchSearchJobs("", "", 1, false);
            }
          }}
        />
      ) : null}

      {/* JOBS GRID */}
      {currentJobs.length > 0 ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {currentJobs.map((job, idx) => (
            <JobCard key={`${job.id}-${idx}`} job={job} onSave={(j) => void save(j)} />
          ))}
        </div>
      ) : null}

      {/* VIEW MORE JOBS BUTTON */}
      {currentJobs.length > 0 && hasMore ? (
        <div className="flex justify-center pt-6 pb-4">
          <Button
            variant="outline"
            size="lg"
            onClick={handleLoadMore}
            disabled={loadingMore || recLoading}
            className="px-8 border-border hover:bg-surface-hover cursor-pointer shadow-sm"
          >
            {loadingMore ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" />
                Loading more jobs…
              </>
            ) : (
              <>
                <Plus className="size-4 mr-2" />
                View more jobs
              </>
            )}
          </Button>
        </div>
      ) : currentJobs.length > 0 && !hasMore ? (
        <p className="text-center text-xs text-muted-foreground pt-6 pb-2">
          You have reached the end of the available job listings.
        </p>
      ) : null}
    </AppShell>
  );
}
