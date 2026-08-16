import { Logo } from "@/components/common/Logo";
import authHero from "@/assets/illustrations/auth-hero.jpg";

const HIGHLIGHTS = [
  "Resume analysis and AI-assisted refinement grounded in your own experience",
  "Role and company-specific interview preparation across DSA, coding, technical, project and HR",
  "Explained job matching — every score shows the skills behind it",
];

export function AuthLayout({ title, description, children }) {
  return (
    <div className="grid min-h-screen bg-background text-foreground lg:grid-cols-2">
      <div className="flex items-center justify-center bg-background px-6 py-12 sm:px-10">
        <div className="w-full max-w-105">
          <div className="mb-8 flex items-center gap-2.5">
            <Logo />
            <span className="text-sm font-semibold tracking-tight text-foreground">
              FutureReady
            </span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-[26px]">
            {title}
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm leading-normal text-muted-foreground">
            {description}
          </p>
          <div className="mt-6">{children}</div>
        </div>
      </div>

      <div className="hidden flex-col justify-between border-l border-border bg-surface p-12 lg:flex">
        <div className="flex flex-1 items-center justify-center">
          <img
            src={authHero}
            alt=""
            width={1024}
            height={1280}
            className="max-h-105 w-auto object-contain dark:opacity-85"
          />
        </div>
        <div className="max-w-md">
          <h2 className="text-[17px] font-semibold leading-snug text-foreground">
            One connected career journey, from profile to offer.
          </h2>
          <ul className="mt-5 space-y-2.5 text-xs sm:text-sm leading-normal text-muted-foreground">
            {HIGHLIGHTS.map((h) => (
              <li key={h} className="flex gap-2.5">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
