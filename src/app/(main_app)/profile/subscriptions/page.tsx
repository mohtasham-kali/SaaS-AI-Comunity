
'use client';

import { useAuth } from '@/components/auth/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import type { Plan } from '@/types';
import { CheckCircle, Gem, Loader2, Sparkles, Star, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface PlanFeature {
  text: string;
  included: boolean;
}

interface PlanDetails {
  id: Plan;
  name: string;
  description: string;
  priceMonthly?: string; // Optional, for future use
  icon: React.ElementType;
  features: PlanFeature[];
  cta: string;
  isCurrent?: boolean; // Will be set dynamically
}

const plansData: Omit<PlanDetails, 'isCurrent' | 'cta'>[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Get started with basic AI tools and community access.',
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
    name: 'Standard',
    description: 'More AI power and higher limits for frequent users.',
    priceMonthly: '$10/mo',
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
    name: 'Community',
    description: 'Unlimited AI assistance and the highest limits for power users.',
    priceMonthly: '$25/mo',
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

export default function SubscriptionsPage() {
  const { currentUser, updateUserPlan, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isUpdatingPlan, setIsUpdatingPlan] = useState<Plan | null>(null);

  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.push('/login?redirect=/profile/subscriptions');
    }
  }, [currentUser, authLoading, router]);
  
  useEffect(() => {
    document.title = "Manage Subscription - CodeAssist";
  }, []);


  const handlePlanChange = async (newPlanId: Plan) => {
    if (!currentUser || currentUser.plan === newPlanId) return;
    setIsUpdatingPlan(newPlanId);
    const success = await updateUserPlan(newPlanId);
    setIsUpdatingPlan(null);
    if (success) {
      toast({
        title: 'Plan Updated!',
        description: `You are now on the ${newPlanId} plan.`,
      });
    } else {
      toast({
        title: 'Update Failed',
        description: 'Could not update your plan. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (authLoading || !currentUser) {
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  const currentPlanId = currentUser.plan;

  const plansToDisplay: PlanDetails[] = plansData.map(p => ({
    ...p,
    isCurrent: p.id === currentPlanId,
    cta: p.id === currentPlanId 
      ? "Current Plan" 
      : ( (currentPlanId === 'free' && (p.id === 'Standard' || p.id === 'Community')) || 
          (currentPlanId === 'Standard' && p.id === 'Community') 
        ? "Upgrade" 
        : "Switch Plan" // Covers downgrades or lateral moves if ever introduced
      ),
  }));


  return (
    <div className="container mx-auto py-8">
      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center">
            <Gem className="mr-3 h-8 w-8 text-primary" />
            Manage Your Subscription
          </CardTitle>
          <CardDescription className="text-lg">
            Choose the plan that best fits your needs. Your current plan is: <span className="font-semibold text-primary">{currentUser.plan}</span>.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plansToDisplay.map((plan) => (
          <Card key={plan.id} className={`flex flex-col shadow-xl hover:shadow-2xl transition-shadow duration-300 ${plan.isCurrent ? 'border-2 border-primary ring-2 ring-primary/30' : 'border-border'}`}>
            <CardHeader className="items-center text-center p-6 bg-muted/30">
              <plan.icon className={`h-12 w-12 mb-3 ${plan.isCurrent ? 'text-primary' : 'text-muted-foreground'}`} />
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              {plan.priceMonthly && <p className="text-xl font-semibold text-foreground">{plan.priceMonthly}</p>}
              <CardDescription className="text-sm min-h-[40px]">{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow p-6 space-y-3">
              <ul className="space-y-2 text-sm">
                {plan.features.map((feature, index) => (
                  <li key={index} className={`flex items-center ${feature.included ? 'text-foreground' : 'text-muted-foreground line-through'}`}>
                    <CheckCircle className={`h-4 w-4 mr-2 flex-shrink-0 ${feature.included ? 'text-green-500' : 'text-muted-foreground/50'}`} />
                    {feature.text}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="p-6 border-t">
              <Button
                className="w-full text-base py-3"
                onClick={() => handlePlanChange(plan.id)}
                disabled={plan.isCurrent || isUpdatingPlan !== null}
                variant={plan.isCurrent ? 'outline' : 'default'}
              >
                {isUpdatingPlan === plan.id ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : plan.isCurrent ? null : (
                  plan.id === 'free' ? <Zap className="mr-2 h-5 w-5"/> : <Zap className="mr-2 h-5 w-5" /> 
                )}
                {isUpdatingPlan === plan.id ? "Updating..." : plan.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
