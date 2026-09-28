import { useMemo, useState } from 'react';
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
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipProps,
} from 'recharts';
import { Table2, TrendingDown, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn, formatNumber } from '@/lib/utils';
import type { ChartData } from '@/types/chart';

const MAX_SERIES = 5; // one per --chart-N token; never cycle colors
const seriesColor = (index: number) => `hsl(var(--chart-${index + 1}))`;

const axisProps = {
  stroke: 'hsl(var(--muted-foreground))',
  fontSize: 11,
  tickLine: false,
  axisLine: false,
} as const;

function ChartTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border bg-card px-3 py-2 text-xs shadow-md">
      {label !== undefined && <div className="mb-1 font-medium text-foreground">{label}</div>}
      {payload.map((item) => (
        <div key={String(item.dataKey ?? item.name)} className="flex items-center gap-2">
          <span className="size-2 rounded-full" style={{ background: item.color ?? item.payload?.fill }} />
          <span className="text-muted-foreground">{item.name}</span>
          <span className="ml-auto pl-3 font-medium tabular-nums text-foreground">{formatNumber(item.value)}</span>
        </div>
      ))}
    </div>
  );
}

const legend = <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />;

export function FinanceChart({ chart }: { chart: ChartData }) {
  const [showTable, setShowTable] = useState(false);
  const { chartType, config, data } = chart;
  const xKey = config.xAxisKey ?? 'name';

  const series = useMemo(
    () =>
      Object.entries(chart.chartConfig)
        .slice(0, MAX_SERIES)
        .map(([key, item], index) => ({ key, label: item.label, stacked: item.stacked, color: seriesColor(index) })),
    [chart.chartConfig],
  );

  // Pie: keep the largest slices and fold the rest into "Other" so every slice gets a distinct color.
  const pieData = useMemo(() => {
    if (chartType !== 'pie') return [];
    const rows = data
      .map((row) => ({ segment: String(row.segment ?? ''), value: Number(row.value) || 0 }))
      .sort((a, b) => b.value - a.value);
    if (rows.length <= MAX_SERIES) return rows;
    const head = rows.slice(0, MAX_SERIES - 1);
    const other = rows.slice(MAX_SERIES - 1).reduce((sum, r) => sum + r.value, 0);
    return [...head, { segment: 'Other', value: other }];
  }, [chartType, data]);
  const pieTotal = pieData.reduce((sum, r) => sum + r.value, 0);

  const showLegend = series.length > 1;
  const grid = <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="3 3" />;
  const xAxis = <XAxis dataKey={xKey} {...axisProps} tickMargin={8} minTickGap={16} />;
  const yAxis = <YAxis {...axisProps} width={48} tickFormatter={(v) => formatNumber(v, true)} />;
  const tooltip = <Tooltip content={<ChartTooltip />} cursor={{ fill: 'hsl(var(--muted))', opacity: 0.5 }} />;

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            {grid}
            {xAxis}
            {yAxis}
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeDasharray: '3 3' }} />
            {showLegend && legend}
            {series.map((s) => (
              <Line
                key={s.key}
                dataKey={s.key}
                name={s.label}
                type="monotone"
                stroke={s.color}
                strokeWidth={2}
                dot={data.length <= 12 ? { r: 4, strokeWidth: 2, stroke: 'hsl(var(--card))', fill: s.color } : false}
                activeDot={{ r: 5, strokeWidth: 2, stroke: 'hsl(var(--card))' }}
              />
            ))}
          </LineChart>
        );
      case 'area':
      case 'stackedArea':
        return (
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              {series.map((s) => (
                <linearGradient key={s.key} id={`fill-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={s.color} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={s.color} stopOpacity={0.02} />
                </linearGradient>
              ))}
            </defs>
            {grid}
            {xAxis}
            {yAxis}
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeDasharray: '3 3' }} />
            {showLegend && legend}
            {series.map((s) => (
              <Area
                key={s.key}
                dataKey={s.key}
                name={s.label}
                type="monotone"
                stroke={s.color}
                strokeWidth={2}
                fill={`url(#fill-${s.key})`}
                stackId={chartType === 'stackedArea' || s.stacked ? 'stack' : undefined}
              />
            ))}
          </AreaChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Tooltip content={<ChartTooltip />} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="segment"
              innerRadius="55%"
              outerRadius="80%"
              paddingAngle={2}
              stroke="hsl(var(--card))"
              strokeWidth={2}
            >
              {pieData.map((row, index) => (
                <Cell key={row.segment} fill={seriesColor(index)} />
              ))}
            </Pie>
          </PieChart>
        );
      case 'bar':
      case 'multiBar':
      default:
        return (
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barGap={2}>
            {grid}
            {xAxis}
            {yAxis}
            {tooltip}
            {showLegend && legend}
            {series.map((s) => (
              <Bar
                key={s.key}
                dataKey={s.key}
                name={s.label}
                fill={s.color}
                radius={s.stacked ? 0 : [4, 4, 0, 0]}
                maxBarSize={48}
                stackId={s.stacked ? 'stack' : undefined}
                stroke="hsl(var(--card))"
                strokeWidth={s.stacked ? 2 : 0}
              />
            ))}
          </BarChart>
        );
    }
  };

  const tableColumns = chartType === 'pie' ? ['segment', 'value'] : [xKey, ...series.map((s) => s.key)];
  const tableRows = chartType === 'pie' ? pieData : data;
  const columnLabel = (key: string) =>
    chart.chartConfig[key]?.label ?? (key === 'segment' ? 'Segment' : key === 'value' ? 'Value' : key);

  return (
    <figure className="animate-fade-in rounded-lg border bg-card p-4">
      <figcaption className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-semibold">{config.title}</div>
          {config.description && <p className="mt-0.5 text-xs text-muted-foreground">{config.description}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {config.trend && (
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                config.trend.direction === 'up' ? 'bg-positive/10 text-positive' : 'bg-negative/10 text-negative',
              )}
            >
              {config.trend.direction === 'up' ? <TrendingUp className="size-3.5" /> : <TrendingDown className="size-3.5" />}
              {config.trend.direction === 'up' ? '+' : '-'}
              {Math.abs(config.trend.percentage)}%
            </span>
          )}
          <Button
            variant="ghost"
            size="icon-sm"
            aria-pressed={showTable}
            aria-label={showTable ? 'Show chart' : 'Show data table'}
            title={showTable ? 'Show chart' : 'Show data table'}
            onClick={() => setShowTable((v) => !v)}
          >
            <Table2 />
          </Button>
        </div>
      </figcaption>

      {showTable ? (
        <div className="max-h-72 overflow-auto scrollbar-thin">
          <table className="w-full text-xs">
            <thead>
              <tr>
                {tableColumns.map((col) => (
                  <th key={col} className="sticky top-0 bg-muted px-2 py-1.5 text-left font-medium">
                    {columnLabel(col)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row, i) => (
                <tr key={i} className="border-b last:border-0">
                  {tableColumns.map((col) => (
                    <td key={col} className="px-2 py-1.5 tabular-nums">
                      {formatNumber((row as Record<string, unknown>)[col])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="relative h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
          {chartType === 'pie' && (
            <div className="pointer-events-none absolute inset-x-0 top-[calc(50%-18px)] -translate-y-1/2 text-center">
              <div className="text-lg font-semibold tabular-nums">{formatNumber(pieTotal, true)}</div>
              <div className="text-[11px] text-muted-foreground">{config.totalLabel ?? 'Total'}</div>
            </div>
          )}
        </div>
      )}

      {config.footer && <p className="mt-3 text-[11px] text-muted-foreground">{config.footer}</p>}
    </figure>
  );
}
