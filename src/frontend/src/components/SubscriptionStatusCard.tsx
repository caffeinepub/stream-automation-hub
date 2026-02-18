import { useGetCallerUserProfile } from '../hooks/useQueries';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { CreditCard, Calendar, CheckCircle2, XCircle } from 'lucide-react';

export default function SubscriptionStatusCard() {
  const { data: userProfile, isLoading } = useGetCallerUserProfile();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  const isActive = userProfile?.subscriptionStatus === 'active';
  const isCancelled = userProfile?.subscriptionStatus === 'cancelled';
  const isInactive = userProfile?.subscriptionStatus === 'inactive' || !userProfile?.subscriptionStatus;

  const formatDate = (timestamp?: bigint) => {
    if (!timestamp) return 'N/A';
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getTierLabel = () => {
    if (!userProfile?.subscriptionTier) return 'None';
    return userProfile.subscriptionTier === 'monthly' ? 'Monthly' : 'Annual';
  };

  if (isInactive) {
    return (
      <Card className="border-2 border-muted">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-muted-foreground" />
            No Active Subscription
          </CardTitle>
          <CardDescription>
            Subscribe to unlock all features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            You don't have an active subscription. Subscribe now to access full Twitch account management, 
            unlimited revenue tracking, and priority support.
          </p>
          <Button onClick={() => navigate({ to: '/subscription-plans' })} className="gap-2">
            <CreditCard className="h-4 w-4" />
            View Plans
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-2 ${isActive ? 'border-[oklch(0.55_0.12_120)]' : 'border-destructive/50'}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {isActive ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-[oklch(0.55_0.12_120)]" />
                Active Subscription
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5 text-destructive" />
                Cancelled Subscription
              </>
            )}
          </CardTitle>
          <Badge variant={isActive ? 'default' : 'destructive'}>
            {isActive ? 'Active' : 'Cancelled'}
          </Badge>
        </div>
        <CardDescription>
          {getTierLabel()} Plan
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">Start Date</p>
              <p className="text-sm text-muted-foreground">{formatDate(userProfile?.subscriptionStartDate)}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">
                {isActive ? 'Next Billing Date' : 'End Date'}
              </p>
              <p className="text-sm text-muted-foreground">{formatDate(userProfile?.subscriptionEndDate)}</p>
            </div>
          </div>
        </div>
        {isCancelled && (
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-3">
              Your subscription has been cancelled. You'll continue to have access until the end date.
            </p>
            <Button onClick={() => navigate({ to: '/subscription-plans' })} variant="outline" className="gap-2">
              <CreditCard className="h-4 w-4" />
              Resubscribe
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
