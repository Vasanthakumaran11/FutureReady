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

const axisProps = {
  stroke: "var(--color-muted-foreground)",
  fontSize: 11,
  tickLine: false,
  axisLine: false,
} as const;

const tooltipStyle = {
  contentStyle: {
    background: "var(--color-surface)",
    border: "1px solid var(--color-border)",
    borderRadius: "8px",
    fontSize: "12px",
    color: "var(--color-foreground)",
  },
} as const;

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
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.28} />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
        <XAxis dataKey="week" {...axisProps} />
        <YAxis domain={[0, 100]} {...axisProps} />
        <Tooltip {...tooltipStyle} />
        <Area
          type="monotone"
          dataKey="readiness"
          name="Career readiness"
          stroke="var(--color-primary)"
          strokeWidth={2}
          fill="url(#readinessFill)"
        />
      </AreaChart>
    </Frame>
  );
}

export function SkillGapChart({ data }: { data: DashboardData["skillGapChart"] }) {
  return (
    <Frame height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
        <XAxis dataKey="skill" {...axisProps} interval={0} angle={-20} textAnchor="end" height={54} />
        <YAxis domain={[0, 100]} {...axisProps} />
        <Tooltip {...tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Bar dataKey="required" name="Role requirement" fill="var(--color-chart-2)" radius={[3, 3, 0, 0]} />
        <Bar dataKey="current" name="Your evidence" fill="var(--color-chart-1)" radius={[3, 3, 0, 0]} />
      </BarChart>
    </Frame>
  );
}

export function InterviewProgressChart({ data }: { data: DashboardData["interviewProgress"] }) {
  return (
    <Frame height={240}>
      <RadarChart data={data} outerRadius="72%">
        <PolarGrid stroke="var(--color-border)" />
        <PolarAngleAxis dataKey="category" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
        <Tooltip {...tooltipStyle} />
        <Radar
          name="Preparation"
          dataKey="progress"
          stroke="var(--color-primary)"
          fill="var(--color-primary)"
          fillOpacity={0.25}
        />
      </RadarChart>
    </Frame>
  );
}

export function JobMatchChart({ data }: { data: DashboardData["jobMatchStats"] }) {
  return (
    <Frame>
      <BarChart data={data} layout="vertical" margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
        <XAxis type="number" allowDecimals={false} {...axisProps} />
        <YAxis type="category" dataKey="bucket" width={64} {...axisProps} />
        <Tooltip {...tooltipStyle} />
        <Bar dataKey="jobs" name="Jobs" fill="var(--color-chart-1)" radius={[0, 3, 3, 0]} />
      </BarChart>
    </Frame>
  );
}

const STATUS_COLORS = [
  "var(--color-chart-2)",
  "var(--color-chart-1)",
  "var(--color-chart-4)",
  "var(--color-chart-3)",
  "var(--color-chart-5)",
];

export function ApplicationStatusChart({ data }: { data: DashboardData["applicationStatus"] }) {
  const visible = data.filter((d) => d.count > 0);
  return (
    <Frame>
      <PieChart>
        <Tooltip {...tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Pie data={visible} dataKey="count" nameKey="status" innerRadius={44} outerRadius={72} paddingAngle={2}>
          {visible.map((entry, i) => (
            <Cell key={entry.status} fill={STATUS_COLORS[i % STATUS_COLORS.length]} />
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
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
        <XAxis dataKey="day" {...axisProps} />
        <YAxis allowDecimals={false} {...axisProps} />
        <Tooltip {...tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Line type="monotone" dataKey="planned" name="Planned" stroke="var(--color-chart-2)" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="completed" name="Completed" stroke="var(--color-chart-3)" strokeWidth={2} dot={false} />
      </LineChart>
    </Frame>
  );
}
