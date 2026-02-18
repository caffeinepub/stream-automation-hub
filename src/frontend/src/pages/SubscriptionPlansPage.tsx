import { useGetActiveSubscriptionPlans, useCreateStripeSubscription } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle2, Loader2, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

export default function SubscriptionPlansPage() {
  const { data: plans, isLoading } = useGetActiveSubscriptionPlans();
  const createSubscription = useCreateStripeSubscription();

  const handleSubscribe = async (planId: bigint) => {
    try {
      const session = await createSubscription.mutateAsync(planId);
      if (!session?.url) {
        throw new Error('Stripe session missing url');
      }
      window.location.href = session.url;
    } catch (error: any) {
      toast.error(`Failed to start subscription: ${error.message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <Skeleton className="h-12 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto mb-12" />
          <div className="grid gap-8 md:grid-cols-2">
            <Skeleton className="h-96" />
            <Skeleton className="h-96" />
          </div>
        </div>
      </div>
    );
  }

  const monthlyPlan = plans?.find((p) => p.tier === 'monthly');
  const annualPlan = plans?.find((p) => p.tier === 'annual');

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Choose Your Plan</h1>
          <p className="text-xl text-muted-foreground">
            Unlock all features and start managing your content like a pro
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {monthlyPlan && (
            <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl mb-2">{monthlyPlan.name}</CardTitle>
                <CardDescription className="text-base">{monthlyPlan.description}</CardDescription>
                <div className="mt-6">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl font-bold text-foreground">
                      ${(Number(monthlyPlan.priceInCents) / 100).toFixed(0)}
                    </span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {monthlyPlan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => handleSubscribe(monthlyPlan.id)}
                  disabled={createSubscription.isPending}
                  className="w-full gap-2"
                  size="lg"
                >
                  {createSubscription.isPending ? (
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
              </CardContent>
            </Card>
          )}

          {annualPlan && (
            <Card className="border-2 border-primary hover:border-primary transition-colors relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-1 rounded-full text-sm font-medium">
                  Best Value
                </span>
              </div>
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl mb-2">{annualPlan.name}</CardTitle>
                <CardDescription className="text-base">{annualPlan.description}</CardDescription>
                <div className="mt-6">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl font-bold text-foreground">
                      ${(Number(annualPlan.priceInCents) / 100).toFixed(0)}
                    </span>
                    <span className="text-muted-foreground">/year</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Save ${((Number(monthlyPlan?.priceInCents || 0) * 12 - Number(annualPlan.priceInCents)) / 100).toFixed(0)} per year
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {annualPlan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => handleSubscribe(annualPlan.id)}
                  disabled={createSubscription.isPending}
                  className="w-full gap-2"
                  size="lg"
                >
                  {createSubscription.isPending ? (
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
              </CardContent>
            </Card>
          )}
        </div>

        {(!plans || plans.length === 0) && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No subscription plans available at this time.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
