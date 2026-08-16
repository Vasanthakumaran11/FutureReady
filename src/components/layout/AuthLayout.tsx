import type { ReactNode } from "react";

import { Logo } from "@/components/common/Logo";
import authHero from "@/assets/illustrations/auth-hero.jpg";

const HIGHLIGHTS = [
  "Resume analysis and AI-assisted refinement grounded in your own experience",
  "Role and company-specific interview preparation across DSA, coding, technical, project and HR",
  "Explained job matching — every score shows the skills behind it",
];

export function AuthLayout({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center bg-background px-6 py-12 sm:px-10">
        <div className="w-full max-w-[440px]">
          <div className="mb-10 flex items-center gap-2">
            <Logo />
            <span className="text-sm font-semibold tracking-tight">FutureReady</span>
          </div>
          <h1 className="text-2xl font-semibold leading-8">{title}</h1>
          <p className="mt-2 text-sm leading-[22px] text-muted-foreground">{description}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>

      <div className="hidden flex-col justify-between border-l border-border bg-surface p-12 lg:flex">
        <div className="flex flex-1 items-center justify-center">
          <img
            src={authHero}
            alt=""
            width={1024}
            height={1280}
            className="max-h-[440px] w-auto object-contain mix-blend-multiply"
          />
        </div>
        <div className="max-w-md">
          <h2 className="text-[18px] font-semibold leading-[26px]">
            One connected career journey, from profile to offer.
          </h2>
          <ul className="mt-6 space-y-3 text-sm leading-[22px] text-muted-foreground">
            {HIGHLIGHTS.map((h) => (
              <li key={h} className="flex gap-3">
                <span className="mt-2 size-1 shrink-0 rounded-full bg-primary" aria-hidden />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
