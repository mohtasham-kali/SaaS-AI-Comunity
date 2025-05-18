
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Percent } from "lucide-react"; // Added Percent icon

export default function AnalyticsPage() {
  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <AreaChart className="mr-3 h-6 w-6 text-primary" />
            AI-Powered Usage Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-lg">
            This section will soon feature AI-driven analysis of your platform usage, including insights presented with graphs and percentages.
          </p>
          <div className="mt-6 p-8 bg-muted/50 rounded-lg text-center space-y-4">
            <div className="flex justify-center items-center space-x-4">
                <AreaChart className="h-12 w-12 text-primary/70" />
                <Percent className="h-10 w-10 text-primary/60" />
            </div>
            <h3 className="text-xl font-semibold">Advanced Analytics Coming Soon!</h3>
            <p className="mt-2 text-muted-foreground">
              We're developing AI tools to visualize your activity, identify patterns, and provide personalized insights into your CodeAssist journey.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
