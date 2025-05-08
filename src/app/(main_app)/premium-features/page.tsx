
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export default function PremiumFeaturesPage() {
  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <ShieldCheck className="mr-3 h-6 w-6 text-primary" />
            Premium Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-lg">
            Explore and manage your premium features. This section is currently being developed.
          </p>
          <div className="mt-6 p-8 bg-muted/50 rounded-lg text-center">
            <h3 className="text-xl font-semibold">Unlock More Power!</h3>
            <p className="mt-2 text-muted-foreground">
              Information about premium benefits and subscription management will be here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
