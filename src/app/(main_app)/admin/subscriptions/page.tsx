
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, CheckCircle2, XCircle, Edit2, Gem, Sparkles, Star } from "lucide-react";
import type { Plan } from '@/types';

interface AdminPlanFeature {
  text: string;
  included: boolean;
}

interface AdminPlanDetails {
  id: Plan;
  name: string;
  description: string;
  priceMonthly?: string;
  icon: React.ElementType;
  features: AdminPlanFeature[];
}

// This data mirrors the plan features defined elsewhere for consistency in the mock.
// In a real app, this would come from a central configuration or backend.
const adminPlansData: AdminPlanDetails[] = [
  {
    id: 'free',
    name: 'Free Plan',
    description: 'Basic access for new users, ideal for getting started.',
    icon: Sparkles,
    features: [
      { text: '3 AI Responses / Day', included: true },
      { text: '10 AI Responses / Week', included: true },
      { text: 'Max 3 Files / Upload (up to 5MB each)', included: true },
      { text: 'Community Forum Access', included: true },
      { text: 'Priority Support', included: false },
      { text: 'Access to Beta Features', included: false },
    ],
  },
  {
    id: 'Standard',
    name: 'Standard Plan',
    description: 'Increased limits and priority support for regular users.',
    priceMonthly: '$10/mo (Example Pricing)',
    icon: Star,
    features: [
      { text: '50 AI Responses / Day', included: true },
      { text: '200 AI Responses / Week', included: true },
      { text: 'Max 10 Files / Upload (up to 20MB each)', included: true },
      { text: 'Community Forum Access', included: true },
      { text: 'Priority Support', included: true },
      { text: 'Access to Beta Features', included: false },
    ],
  },
  {
    id: 'Community',
    name: 'Community Plan',
    description: 'Unlimited AI, premium support, and beta access for power users.',
    priceMonthly: '$25/mo (Example Pricing)',
    icon: Gem,
    features: [
      { text: 'Unlimited AI Responses', included: true },
      { text: 'Max 20 Files / Upload (up to 100MB each)', included: true },
      { text: 'Community Forum Access', included: true },
      { text: 'Premium Support', included: true },
      { text: 'Access to Beta Features', included: true },
    ],
  },
];

export default function ManageAdminSubscriptionsPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-3xl font-bold">
            <CreditCard className="mr-3 h-8 w-8 text-primary" />
            Manage Subscription Plans
          </CardTitle>
          <CardDescription className="text-lg">
            View and (conceptually) edit the features, limits, and pricing of subscription plans offered on CodeAssist.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {adminPlansData.map((plan) => (
          <Card key={plan.id} className="flex flex-col shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out">
            <CardHeader className="bg-muted/30 pb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <plan.icon className="h-8 w-8 text-primary" />
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                </div>
                {/* Conceptual Edit Button */}
                <Badge variant="outline" className="cursor-not-allowed border-primary/50 text-primary hover:bg-primary/10">
                  <Edit2 className="mr-1.5 h-3.5 w-3.5" />
                  Edit (Conceptual)
                </Badge>
              </div>
              {plan.priceMonthly && <p className="text-lg font-semibold text-muted-foreground">{plan.priceMonthly}</p>}
              <CardDescription className="text-sm pt-1 min-h-[40px]">{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="p-6 flex-grow">
              <h4 className="text-md font-semibold mb-3 text-foreground">Key Features:</h4>
              <ul className="space-y-2.5 text-sm">
                {plan.features.map((feature, index) => (
                  <li key={index} className={`flex items-start ${feature.included ? 'text-foreground' : 'text-muted-foreground line-through opacity-70'}`}>
                    {feature.included ? 
                      <CheckCircle2 className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-green-500" /> :
                      <XCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-destructive/60" />
                    }
                    <span>{feature.text}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card className="mt-8 bg-accent/10 border-accent/30 shadow-md">
        <CardHeader>
            <CardTitle className="text-xl text-accent-foreground/80">Admin Note: Dynamic Plan Management</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-accent-foreground/70">
                In a live application, this administrative interface would allow for real-time modification of plan details (features, limits, pricing). These changes would be persisted in a database and dynamically fetched by the application to ensure all users see up-to-date subscription information and that system limits are enforced correctly.
            </p>
            <p className="mt-2 text-sm text-accent-foreground/60">
                For this demonstration, plan configurations are displayed as currently defined in the frontend code. True dynamic editing requires backend infrastructure.
            </p>
        </CardContent>
      </Card>

    </div>
  );
}

