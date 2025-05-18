
'use client';

import { useAuth } from '@/components/auth/auth-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart as BarChartIcon, PieChart as PieChartIcon, Activity as ActivityIcon, Loader2 } from "lucide-react";
import { Bar, BarChart, Pie, PieChart as RechartsPieChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend as RechartsLegend, Cell } from "recharts";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface AiToolUsageData {
  name: string;
  count: number;
}

interface ActivityBreakdownData {
  name: string;
  value: number;
  fill: string;
}

const aiToolChartConfig = {
  count: {
    label: "Usage Count",
    color: "hsl(var(--chart-1))",
  },
  bugFixer: {
    label: "Bug Fixer",
    color: "hsl(var(--chart-1))",
  },
  codeGenerator: {
    label: "Code Generator",
    color: "hsl(var(--chart-2))",
  },
  errorExplainer: {
    label: "Error Explainer",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

const activityBreakdownChartConfig = {
  posts: {
    label: "Forum Posts",
    color: "hsl(var(--chart-1))",
  },
  comments: {
    label: "Forum Comments",
    color: "hsl(var(--chart-2))",
  },
  aiTools: {
    label: "AI Tool Interactions",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;


export default function AnalyticsPage() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!currentUser || !currentUser.recentActivities || currentUser.recentActivities.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-3xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <BarChartIcon className="mr-3 h-6 w-6 text-primary" />
              Usage Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mt-6 p-8 bg-muted/50 rounded-lg text-center space-y-4">
              <ActivityIcon className="mx-auto h-12 w-12 text-primary/70" />
              <h3 className="text-xl font-semibold">No Activity Data</h3>
              <p className="mt-2 text-muted-foreground">
                Start using CodeAssist, and your usage analytics will appear here.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const activities = currentUser.recentActivities;

  const bugFixerCount = activities.filter(act => act.type === 'ai_tool_bug_fixer').length;
  const codeGeneratorCount = activities.filter(act => act.type === 'ai_tool_code_generator').length;
  const errorExplainerCount = activities.filter(act => act.type === 'ai_tool_error_explainer').length;
  const forumPostCount = activities.filter(act => act.type === 'forum_post').length;
  const forumCommentCount = activities.filter(act => act.type === 'forum_comment').length;

  const aiToolUsageData: AiToolUsageData[] = [
    { name: 'Bug Fixer', count: bugFixerCount },
    { name: 'Code Generator', count: codeGeneratorCount },
    { name: 'Error Explainer', count: errorExplainerCount },
  ].filter(tool => tool.count > 0);

  const totalAiToolUsage = bugFixerCount + codeGeneratorCount + errorExplainerCount;

  const activityBreakdownData: ActivityBreakdownData[] = [
    { name: 'Forum Posts', value: forumPostCount, fill: activityBreakdownChartConfig.posts.color },
    { name: 'Forum Comments', value: forumCommentCount, fill: activityBreakdownChartConfig.comments.color },
    { name: 'AI Tool Interactions', value: totalAiToolUsage, fill: activityBreakdownChartConfig.aiTools.color },
  ].filter(activity => activity.value > 0);

  return (
    <div className="container mx-auto py-8 space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-3xl font-bold">
            <BarChartIcon className="mr-3 h-8 w-8 text-primary" />
            Your Usage Analytics
          </CardTitle>
          <CardDescription className="text-lg">
            An overview of your activity on CodeAssist.
          </CardDescription>
        </CardHeader>
      </Card>

      {aiToolUsageData.length > 0 && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <BarChartIcon className="mr-2 h-5 w-5 text-primary" />
              AI Tool Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={aiToolChartConfig} className="min-h-[250px] w-full">
              <BarChart data={aiToolUsageData} layout="vertical" margin={{ left: 20, right:20 }}>
                <CartesianGrid horizontal={false} />
                <XAxis type="number" dataKey="count" tickLine={false} axisLine={false} tickMargin={10} />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  tickLine={false} 
                  axisLine={false} 
                  tickMargin={10}
                  width={120}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Bar dataKey="count" radius={5}>
                    {aiToolUsageData.map((entry) => (
                         <Cell key={`cell-${entry.name}`} fill={aiToolChartConfig[entry.name.toLowerCase().replace(/\s+/g, '') as keyof typeof aiToolChartConfig]?.color || "hsl(var(--chart-1))"} />
                    ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {activityBreakdownData.length > 0 && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <PieChartIcon className="mr-2 h-5 w-5 text-primary" />
              Activity Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ChartContainer config={activityBreakdownChartConfig} className="mx-auto aspect-square max-h-[300px]">
              <RechartsPieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={activityBreakdownData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  labelLine={false}
                  label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                    const RADIAN = Math.PI / 180;
                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);
                    return (percent * 100) > 5 ? ( // Only show label if slice is > 5%
                      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize="12px">
                        {`${(percent * 100).toFixed(0)}%`}
                      </text>
                    ) : null;
                  }}
                >
                  {activityBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} stroke={entry.fill} />
                  ))}
                </Pie>
                 <ChartLegend
                    content={<ChartLegendContent nameKey="name" className="text-sm" />}
                    verticalAlign="bottom"
                    align="center"
                  />
              </RechartsPieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {(aiToolUsageData.length === 0 && activityBreakdownData.length === 0) && (
         <Card className="max-w-3xl mx-auto shadow-lg">
          <CardContent>
            <div className="mt-6 p-8 bg-muted/50 rounded-lg text-center space-y-4">
              <ActivityIcon className="mx-auto h-12 w-12 text-primary/70" />
              <h3 className="text-xl font-semibold">Not Enough Activity Data</h3>
              <p className="mt-2 text-muted-foreground">
                We need more activity from you to generate meaningful graphs. Keep using CodeAssist!
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

