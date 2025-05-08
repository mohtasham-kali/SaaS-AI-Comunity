
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <Settings className="mr-3 h-6 w-6 text-primary" />
            Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-lg">
            Configure your application settings and preferences here. This section is under construction.
          </p>
          <div className="mt-6 p-8 bg-muted/50 rounded-lg text-center">
            <h3 className="text-xl font-semibold">Settings Panel Coming Soon!</h3>
            <p className="mt-2 text-muted-foreground">
              Customize your CodeAssist experience.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
