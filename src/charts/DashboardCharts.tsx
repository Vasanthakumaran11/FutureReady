import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { DashboardData } from "@/types";

/** Single shared chart palette — accent + neutral ramp, desaturated status tones. */
export const CHART = {
  accent: "#4338CA",
  accentRamp: ["#4338CA", "#818CF8", "#C7D2FE", "#E4E4E7"],
  neutral: "#A1A1AA",
  success: "#15803D",
  warning: "#B45309",
  danger: "#B91C1C",
  grid: "#F4F4F5",
  axis: "#A1A1AA",
} as const;

const axisProps = {
  stroke: CHART.axis,
  tick: { fill: CHART.axis, fontSize: 12 },
  fontSize: 12,
  tickLine: false,
  axisLine: false,
} as const;

const tooltipStyle = {
  cursor: { fill: CHART.grid },
  contentStyle: {
    background: "var(--color-surface-raised)",
    border: "1px solid var(--color-border)",
    borderRadius: "6px",
    fontSize: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    color: "var(--color-foreground)",
  },
} as const;

const legendStyle = { fontSize: 12, color: CHART.axis } as const;

/** Charts animate once on mount only — never on refetch. */
const animateOnce = { isAnimationActive: true, animationDuration: 300, animationBegin: 0 } as const;

function Frame({ children, height = 220 }: { children: React.ReactElement; height?: number }) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
}

export function ReadinessTrendChart({ data }: { data: DashboardData["readinessTrend"] }) {
  return (
    <Frame>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="readinessFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CHART.accent} stopOpacity={0.16} />
            <stop offset="100%" stopColor={CHART.accent} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} vertical={false} />
        <XAxis dataKey="week" {...axisProps} />
        <YAxis domain={[0, 100]} {...axisProps} />
        <Tooltip {...tooltipStyle} />
        <Area
          type="monotone"
          dataKey="readiness"
          name="Career readiness"
          stroke={CHART.accent}
          strokeWidth={2}
          fill="url(#readinessFill)"
          {...animateOnce}
        />
      </AreaChart>
    </Frame>
  );
}

export function SkillGapChart({ data }: { data: DashboardData["skillGapChart"] }) {
  return (
    <Frame height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} vertical={false} />
        <XAxis dataKey="skill" {...axisProps} interval={0} angle={-20} textAnchor="end" height={54} />
        <YAxis domain={[0, 100]} {...axisProps} />
        <Tooltip {...tooltipStyle} />
        <Legend wrapperStyle={legendStyle} />
        <Bar dataKey="required" name="Role requirement" fill={CHART.neutral} radius={[3, 3, 0, 0]} {...animateOnce} />
        <Bar dataKey="current" name="Your evidence" fill={CHART.accent} radius={[3, 3, 0, 0]} {...animateOnce} />
      </BarChart>
    </Frame>
  );
}

export function InterviewProgressChart({ data }: { data: DashboardData["interviewProgress"] }) {
  return (
    <Frame height={240}>
      <RadarChart data={data} outerRadius="72%">
        <PolarGrid stroke={CHART.grid} />
        <PolarAngleAxis dataKey="category" tick={{ fontSize: 12, fill: CHART.axis }} />
        <Tooltip {...tooltipStyle} />
        <Radar
          name="Preparation"
          dataKey="progress"
          stroke={CHART.accent}
          strokeWidth={2}
          fill={CHART.accent}
          fillOpacity={0.16}
          {...animateOnce}
        />
      </RadarChart>
    </Frame>
  );
}

export function JobMatchChart({ data }: { data: DashboardData["jobMatchStats"] }) {
  return (
    <Frame>
      <BarChart data={data} layout="vertical" margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} horizontal={false} />
        <XAxis type="number" allowDecimals={false} {...axisProps} />
        <YAxis type="category" dataKey="bucket" width={64} {...axisProps} />
        <Tooltip {...tooltipStyle} />
        <Bar dataKey="jobs" name="Jobs" radius={[0, 3, 3, 0]} {...animateOnce}>
          {data.map((entry, i) => (
            <Cell key={entry.bucket} fill={CHART.accentRamp[i % CHART.accentRamp.length]} />
          ))}
        </Bar>
      </BarChart>
    </Frame>
  );
}

export function ApplicationStatusChart({ data }: { data: DashboardData["applicationStatus"] }) {
  const visible = data.filter((d) => d.count > 0);
  return (
    <Frame>
      <PieChart>
        <Tooltip {...tooltipStyle} />
        <Legend wrapperStyle={legendStyle} />
        <Pie
          data={visible}
          dataKey="count"
          nameKey="status"
          innerRadius={44}
          outerRadius={72}
          paddingAngle={2}
          {...animateOnce}
        >
          {visible.map((entry, i) => (
            <Cell key={entry.status} fill={CHART.accentRamp[i % CHART.accentRamp.length]} stroke="none" />
          ))}
        </Pie>
      </PieChart>
    </Frame>
  );
}

export function TaskCompletionChart({ data }: { data: DashboardData["taskCompletion"] }) {
  return (
    <Frame>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} vertical={false} />
        <XAxis dataKey="day" {...axisProps} />
        <YAxis allowDecimals={false} {...axisProps} />
        <Tooltip {...tooltipStyle} />
        <Legend wrapperStyle={legendStyle} />
        <Line type="monotone" dataKey="planned" name="Planned" stroke={CHART.neutral} strokeWidth={2} dot={false} {...animateOnce} />
        <Line type="monotone" dataKey="completed" name="Completed" stroke={CHART.accent} strokeWidth={2} dot={false} {...animateOnce} />
      </LineChart>
    </Frame>
  );
}
