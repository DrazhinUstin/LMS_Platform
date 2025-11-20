'use client';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/app/components/ui/chart';

const chartConfig = {
  enrollments: {
    label: 'Enrollments',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

export default function EnrollmentsPerDayChart({
  chartData,
}: {
  chartData: Array<{ date: string; enrollments: number }>;
}) {
  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          tickMargin={8}
          minTickGap={32}
          axisLine={false}
          tickFormatter={(value) =>
            new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short' }).format(
              new Date(value)
            )
          }
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              labelFormatter={(label) =>
                new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'long' }).format(
                  new Date(label)
                )
              }
            />
          }
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="enrollments" fill="var(--color-enrollments)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
