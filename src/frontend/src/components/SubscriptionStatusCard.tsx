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
    return userProfile.subscriptionTier === 'monthly' ? 'Monthly ($100/mo)' : 'Annual ($500/yr)';
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
            You don't have an active subscription. Subscribe now to access all premium features.
          </p>
          <Button onClick={() => navigate({ to: '/subscription-plans' })} className="w-full gap-2">
            <CreditCard className="h-4 w-4" />
            View Subscription Plans
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isCancelled) {
    return (
      <Card className="border-2 border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-destructive" />
            Subscription Cancelled
          </CardTitle>
          <CardDescription>
            Your subscription has been cancelled
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Plan:</span>
              <span className="font-medium">{getTierLabel()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Access Until:</span>
              <span className="font-medium">{formatDate(userProfile?.subscriptionEndDate)}</span>
            </div>
          </div>
          <Button onClick={() => navigate({ to: '/subscription-plans' })} className="w-full gap-2">
            <CreditCard className="h-4 w-4" />
            Resubscribe
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-primary/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          Active Subscription
        </CardTitle>
        <CardDescription>
          You have full access to all features
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Plan:</span>
            <Badge variant="default">{getTierLabel()}</Badge>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Started:</span>
            <span className="font-medium">{formatDate(userProfile?.subscriptionStartDate)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Renews:</span>
            <span className="font-medium">{formatDate(userProfile?.subscriptionEndDate)}</span>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate({ to: '/subscription-management' })}
          className="w-full gap-2"
        >
          <Calendar className="h-4 w-4" />
          Manage Subscription
        </Button>
      </CardContent>
    </Card>
  );
}
