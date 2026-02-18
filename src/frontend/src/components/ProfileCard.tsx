import { useGetCallerUserProfile, useIsUserOwner } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Crown, Settings, User } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { Skeleton } from './ui/skeleton';

export default function ProfileCard() {
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: isOwner, isLoading: ownerLoading } = useIsUserOwner();
  const navigate = useNavigate();

  if (profileLoading || ownerLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!userProfile) {
    return null;
  }

  const subscriptionStatusText = {
    active: 'Active',
    inactive: 'Inactive',
    cancelled: 'Cancelled',
  }[userProfile.subscriptionStatus];

  const subscriptionTierText = userProfile.subscriptionTier
    ? userProfile.subscriptionTier === 'monthly'
      ? 'Monthly'
      : 'Annual'
    : 'None';

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[oklch(0.65_0.15_25)] to-[oklch(0.55_0.12_120)] flex items-center justify-center shadow-md">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                {userProfile.name}
                {isOwner && (
                  <Badge className="bg-gradient-to-r from-[oklch(0.70_0.15_40)] to-[oklch(0.65_0.12_50)] text-white border-0 gap-1">
                    <Crown className="h-3 w-3" />
                    Owner
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>Your profile information</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Subscription Status</p>
            <p className="font-medium text-foreground">{subscriptionStatusText}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Subscription Tier</p>
            <p className="font-medium text-foreground">{subscriptionTierText}</p>
          </div>
        </div>
        {isOwner && (
          <Button
            onClick={() => navigate({ to: '/admin' })}
            className="w-full gap-2"
            variant="outline"
          >
            <Settings className="h-4 w-4" />
            Admin Dashboard
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
