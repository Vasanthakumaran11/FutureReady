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

import { useTheme } from "@/hooks/useTheme";

/** Dynamic chart color tokens responding to resolved theme */
function useChartTheme() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return {
    accent: isDark ? "#6E8FF0" : "#3B5FE0",
    accentSubtle: isDark ? "#23293D" : "#EAEEFC",
    accentRamp: isDark
      ? ["#6E8FF0", "#8EA8F5", "#A4BAF7", "#23293D"]
      : ["#3B5FE0", "#6E8FF0", "#A4BAF7", "#EAEEFC"],
    neutral: isDark ? "#A6A5A0" : "#6F6E69",
    tertiary: isDark ? "#757471" : "#A19F98",
    grid: isDark ? "#2F2F2D" : "#E9E8E4",
    surface: isDark ? "#212120" : "#FFFFFF",
    textPrimary: isDark ? "#EDECE9" : "#2B2925",
    border: isDark ? "#2F2F2D" : "#E9E8E4",
  };
}

const animateOnce = {
  isAnimationActive: true,
  animationDuration: 500,
  animationEasing: "ease-out",
  animationBegin: 0,
};

function Frame({ children, height = 220 }) {
  return (
    <div style={{ width: "100%", height }} className="pt-2">
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
}

export function ReadinessTrendChart({ data }) {
  const t = useChartTheme();

  const axisProps = {
    stroke: t.tertiary,
    tick: { fill: t.tertiary, fontSize: 11 },
    fontSize: 11,
    tickLine: false,
    axisLine: false,
  };

  const tooltipStyle = {
    cursor: { fill: t.grid, opacity: 0.5 },
    contentStyle: {
      background: t.surface,
      border: `1px solid ${t.border}`,
      borderRadius: "8px",
      fontSize: "12px",
      boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
      color: t.textPrimary,
      padding: "8px 12px",
    },
  };

  return (
    <Frame>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="readinessFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={t.accent} stopOpacity={0.2} />
            <stop offset="100%" stopColor={t.accent} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={t.grid} vertical={false} />
        <XAxis dataKey="week" {...axisProps} />
        <YAxis domain={[0, 100]} {...axisProps} />
        <Tooltip {...tooltipStyle} />
        <Area
          type="monotone"
          dataKey="readiness"
          name="Career readiness"
          stroke={t.accent}
          strokeWidth={2}
          fill="url(#readinessFill)"
          {...animateOnce}
        />
      </AreaChart>
    </Frame>
  );
}

export function SkillGapChart({ data }) {
  const t = useChartTheme();

  const axisProps = {
    stroke: t.tertiary,
    tick: { fill: t.tertiary, fontSize: 11 },
    fontSize: 11,
    tickLine: false,
    axisLine: false,
  };

  const tooltipStyle = {
    cursor: { fill: t.grid, opacity: 0.5 },
    contentStyle: {
      background: t.surface,
      border: `1px solid ${t.border}`,
      borderRadius: "8px",
      fontSize: "12px",
      boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
      color: t.textPrimary,
      padding: "8px 12px",
    },
  };

  return (
    <Frame height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={t.grid} vertical={false} />
        <XAxis
          dataKey="skill"
          {...axisProps}
          interval={0}
          angle={-20}
          textAnchor="end"
          height={54}
        />
        <YAxis domain={[0, 100]} {...axisProps} />
        <Tooltip {...tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 12, color: t.neutral, paddingTop: 4 }} />
        <Bar
          dataKey="required"
          name="Role requirement"
          fill={t.neutral}
          radius={[4, 4, 0, 0]}
          {...animateOnce}
        />
        <Bar
          dataKey="current"
          name="Your evidence"
          fill={t.accent}
          radius={[4, 4, 0, 0]}
          {...animateOnce}
        />
      </BarChart>
    </Frame>
  );
}

export function InterviewProgressChart({ data }) {
  const t = useChartTheme();

  const tooltipStyle = {
    contentStyle: {
      background: t.surface,
      border: `1px solid ${t.border}`,
      borderRadius: "8px",
      fontSize: "12px",
      boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
      color: t.textPrimary,
      padding: "8px 12px",
    },
  };

  return (
    <Frame height={240}>
      <RadarChart data={data} outerRadius="72%">
        <PolarGrid stroke={t.grid} />
        <PolarAngleAxis dataKey="category" tick={{ fontSize: 11, fill: t.neutral }} />
        <Tooltip {...tooltipStyle} />
        <Radar
          name="Preparation"
          dataKey="progress"
          stroke={t.accent}
          strokeWidth={2}
          fill={t.accent}
          fillOpacity={0.18}
          {...animateOnce}
        />
      </RadarChart>
    </Frame>
  );
}

export function JobMatchChart({ data }) {
  const t = useChartTheme();

  const axisProps = {
    stroke: t.tertiary,
    tick: { fill: t.tertiary, fontSize: 11 },
    fontSize: 11,
    tickLine: false,
    axisLine: false,
  };

  const tooltipStyle = {
    cursor: { fill: t.grid, opacity: 0.5 },
    contentStyle: {
      background: t.surface,
      border: `1px solid ${t.border}`,
      borderRadius: "8px",
      fontSize: "12px",
      boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
      color: t.textPrimary,
      padding: "8px 12px",
    },
  };

  return (
    <Frame>
      <BarChart data={data} layout="vertical" margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={t.grid} horizontal={false} />
        <XAxis type="number" allowDecimals={false} {...axisProps} />
        <YAxis type="category" dataKey="bucket" width={64} {...axisProps} />
        <Tooltip {...tooltipStyle} />
        <Bar dataKey="jobs" name="Jobs" radius={[0, 4, 4, 0]} {...animateOnce}>
          {data.map((entry, i) => (
            <Cell key={entry.bucket} fill={t.accentRamp[i % t.accentRamp.length]} />
          ))}
        </Bar>
      </BarChart>
    </Frame>
  );
}

export function ApplicationStatusChart({ data }) {
  const t = useChartTheme();
  const visible = data.filter((d) => d.count > 0);

  const tooltipStyle = {
    contentStyle: {
      background: t.surface,
      border: `1px solid ${t.border}`,
      borderRadius: "8px",
      fontSize: "12px",
      boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
      color: t.textPrimary,
      padding: "8px 12px",
    },
  };

  return (
    <Frame>
      <PieChart>
        <Tooltip {...tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 12, color: t.neutral }} />
        <Pie
          data={visible}
          dataKey="count"
          nameKey="status"
          innerRadius={44}
          outerRadius={72}
          paddingAngle={3}
          {...animateOnce}
        >
          {visible.map((entry, i) => (
            <Cell
              key={entry.status}
              fill={t.accentRamp[i % t.accentRamp.length]}
              stroke={t.surface}
              strokeWidth={1.5}
            />
          ))}
        </Pie>
      </PieChart>
    </Frame>
  );
}

export function TaskCompletionChart({ data }) {
  const t = useChartTheme();

  const axisProps = {
    stroke: t.tertiary,
    tick: { fill: t.tertiary, fontSize: 11 },
    fontSize: 11,
    tickLine: false,
    axisLine: false,
  };

  const tooltipStyle = {
    cursor: { fill: t.grid, opacity: 0.5 },
    contentStyle: {
      background: t.surface,
      border: `1px solid ${t.border}`,
      borderRadius: "8px",
      fontSize: "12px",
      boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
      color: t.textPrimary,
      padding: "8px 12px",
    },
  };

  return (
    <Frame>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={t.grid} vertical={false} />
        <XAxis dataKey="day" {...axisProps} />
        <YAxis allowDecimals={false} {...axisProps} />
        <Tooltip {...tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 12, color: t.neutral, paddingTop: 4 }} />
        <Line
          type="monotone"
          dataKey="planned"
          name="Planned"
          stroke={t.neutral}
          strokeWidth={2}
          dot={{ r: 3, fill: t.neutral }}
          {...animateOnce}
        />
        <Line
          type="monotone"
          dataKey="completed"
          name="Completed"
          stroke={t.accent}
          strokeWidth={2}
          dot={{ r: 3, fill: t.accent }}
          {...animateOnce}
        />
      </LineChart>
    </Frame>
  );
}
