import { ReactNode } from 'react';
import { useCheckSubscriptionStatus } from '../hooks/useQueries';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Lock, CreditCard } from 'lucide-react';

interface SubscriptionGuardProps {
  children: ReactNode;
}

export default function SubscriptionGuard({ children }: SubscriptionGuardProps) {
  const { data: subscriptionStatus, isLoading } = useCheckSubscriptionStatus();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (subscriptionStatus === 'inactive' || subscriptionStatus === 'cancelled') {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="border-2 border-primary">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Lock className="h-10 w-10 text-primary" />
                </div>
              </div>
              <CardTitle className="text-3xl">Subscription Required</CardTitle>
              <CardDescription className="text-base mt-2">
                This feature requires an active subscription
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                To access Twitch account management and revenue tracking features, you need an active subscription.
              </p>
              <ul className="text-left max-w-md mx-auto space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-primary" />
                  <span>Full Twitch account management</span>
                </li>
                <li className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-primary" />
                  <span>Unlimited revenue tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-primary" />
                  <span>Priority support</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button
                size="lg"
                onClick={() => navigate({ to: '/subscription-plans' })}
                className="gap-2"
              >
                <CreditCard className="h-4 w-4" />
                View Subscription Plans
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
