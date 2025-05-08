
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <Briefcase className="mr-3 h-6 w-6 text-primary" />
            Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-lg">
            Welcome to your dashboard. This section is currently under development.
          </p>
          <div className="mt-6 p-8 bg-muted/50 rounded-lg text-center">
            <h3 className="text-xl font-semibold">Coming Soon!</h3>
            <p className="mt-2 text-muted-foreground">
              Exciting features and insights will be available here shortly.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
