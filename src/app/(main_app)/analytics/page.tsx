
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <AreaChart className="mr-3 h-6 w-6 text-primary" />
            Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-lg">
            Detailed analytics and reports will be displayed here. This section is currently under development.
          </p>
          <div className="mt-6 p-8 bg-muted/50 rounded-lg text-center">
            <h3 className="text-xl font-semibold">Feature In Progress!</h3>
            <p className="mt-2 text-muted-foreground">
              We are working hard to bring you powerful data visualizations.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
