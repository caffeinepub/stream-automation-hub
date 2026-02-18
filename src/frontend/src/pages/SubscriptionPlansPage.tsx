import { useState } from 'react';
import { useCreateStripeSubscription, useGetAllSubscriptionPlans } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Loader2, CreditCard } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function SubscriptionPlansPage() {
  const createSubscription = useCreateStripeSubscription();
  const { data: plans, isLoading: plansLoading } = useGetAllSubscriptionPlans();
  const [selectedPlanId, setSelectedPlanId] = useState<bigint | null>(null);

  const handleSubscribe = async (planId: bigint) => {
    setSelectedPlanId(planId);
    try {
      const session = await createSubscription.mutateAsync(planId);
      if (!session?.url) {
        throw new Error('Stripe session missing url');
      }
      window.location.href = session.url;
    } catch (error) {
      console.error('Subscription error:', error);
      setSelectedPlanId(null);
    }
  };

  // Filter active plans by tier
  const activePlans = plans?.filter(plan => plan.isActive) || [];
  const monthlyPlan = activePlans.find(plan => plan.tier === 'monthly');
  const annualPlan = activePlans.find(plan => plan.tier === 'annual');

  if (plansLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="h-96" />
            <Skeleton className="h-96" />
          </div>
        </div>
      </div>
    );
  }

  if (!monthlyPlan && !annualPlan) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">Choose Your Plan</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Subscription plans are currently being configured. Please check back soon.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Choose Your Plan</h1>
          <p className="text-lg text-muted-foreground">
            Unlock full access to Stream Automation Hub and manage your Twitch revenue effortlessly
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Monthly Plan */}
          {monthlyPlan && (
            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <CardTitle className="text-2xl">{monthlyPlan.name}</CardTitle>
                <CardDescription>{monthlyPlan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">
                    ${(Number(monthlyPlan.priceInCents) / 100).toFixed(2)}
                  </span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {monthlyPlan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-[oklch(0.55_0.12_120)]" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full gap-2"
                  size="lg"
                  onClick={() => handleSubscribe(monthlyPlan.id)}
                  disabled={createSubscription.isPending}
                >
                  {createSubscription.isPending && selectedPlanId === monthlyPlan.id ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4" />
                      Subscribe Monthly
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Annual Plan */}
          {annualPlan && (
            <Card className="border-2 border-primary relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                  Best Value
                </span>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">{annualPlan.name}</CardTitle>
                <CardDescription>{annualPlan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">
                    ${(Number(annualPlan.priceInCents) / 100).toFixed(2)}
                  </span>
                  <span className="text-muted-foreground">/year</span>
                </div>
                {monthlyPlan && (
                  <p className="text-sm text-muted-foreground mt-2">
                    That's just ${(Number(annualPlan.priceInCents) / 100 / 12).toFixed(2)}/month
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {annualPlan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-[oklch(0.55_0.12_120)]" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full gap-2"
                  size="lg"
                  onClick={() => handleSubscribe(annualPlan.id)}
                  disabled={createSubscription.isPending}
                >
                  {createSubscription.isPending && selectedPlanId === annualPlan.id ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4" />
                      Subscribe Annually
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Secure payment processing powered by Stripe. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
