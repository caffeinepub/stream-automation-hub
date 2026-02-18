import { ReactNode } from 'react';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useNavigate } from '@tanstack/react-router';
import { Lock } from 'lucide-react';
import { SubscriptionStatus } from '../backend';

interface SubscriptionGuardProps {
  children: ReactNode;
}

export default function SubscriptionGuard({ children }: SubscriptionGuardProps) {
  const { data: userProfile, isLoading } = useGetCallerUserProfile();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const isOwner = userProfile?.isOwner === true;
  const hasActiveSubscription = userProfile?.subscriptionStatus === SubscriptionStatus.active;

  if (isOwner || hasActiveSubscription) {
    return <>{children}</>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Card className="border-2 border-primary/20">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Subscription Required</CardTitle>
            <CardDescription className="text-base">
              This feature requires an active subscription to access.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Premium Features Include:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  Unlimited Twitch account management
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  Advanced revenue tracking and analytics
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  Finance tracker and donation manager
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  Priority support
                </li>
              </ul>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => navigate({ to: '/subscription-plans' })}
                className="flex-1"
              >
                View Subscription Plans
              </Button>
              <Button
                onClick={() => navigate({ to: '/' })}
                variant="outline"
                className="flex-1"
              >
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
