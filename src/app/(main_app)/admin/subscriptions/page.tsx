
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

export default function ManageSubscriptionsPage() {
  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <CreditCard className="mr-3 h-6 w-6 text-primary" />
            Manage Subscriptions (Admin)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-lg">
            Subscription management tools for administrators. This section is currently under development.
          </p>
          <div className="mt-6 p-8 bg-muted/50 rounded-lg text-center">
            <h3 className="text-xl font-semibold">Subscription Admin Panel!</h3>
            <p className="mt-2 text-muted-foreground">
              Tools for overseeing user subscriptions will be here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
