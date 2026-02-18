import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetTwitchAccount, useGetAllRevenueEntries, useUpgradeTwitchAccount, useGetCallerUserProfile, useCheckSubscriptionStatus } from '../hooks/useQueries';
import { Variant_affiliate_partner } from '../backend';
import RevenueChart from '../components/RevenueChart';
import SubscriptionGuard from '../components/SubscriptionGuard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ArrowLeft, DollarSign, TrendingUp, Award } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

export default function RevenueDetailsPage() {
  const { accountId } = useParams({ strict: false });
  const navigate = useNavigate();
  const accountIdBigInt = accountId ? BigInt(accountId) : null;
  
  const { data: account, isLoading: accountLoading } = useGetTwitchAccount(accountIdBigInt);
  const { data: allRevenues = [], isLoading: revenuesLoading } = useGetAllRevenueEntries();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: subscriptionStatus } = useCheckSubscriptionStatus();
  const upgradeMutation = useUpgradeTwitchAccount();

  const accountRevenues = allRevenues.filter(
    (rev) => accountIdBigInt && rev.accountId === accountIdBigInt
  );

  const totalRevenue = accountRevenues.reduce((sum, entry) => sum + entry.amount, 0);

  const isOwner = userProfile?.isOwner || false;
  const hasActiveSubscription = subscriptionStatus === 'active';
  const canUpgrade = isOwner || hasActiveSubscription;

  const handleUpgrade = async (targetType: Variant_affiliate_partner) => {
    if (!accountIdBigInt) return;
    await upgradeMutation.mutateAsync({
      accountId: accountIdBigInt,
      accountType: targetType,
    });
  };

  if (accountLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-64 mb-6" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!account) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Account not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isPartner = account.accountType === Variant_affiliate_partner.partner;
  const isAffiliate = account.accountType === Variant_affiliate_partner.affiliate;

  return (
    <SubscriptionGuard>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                onClick={() => navigate({ to: '/twitch-accounts' })}
                className="cursor-pointer"
              >
                Twitch Accounts
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{account.username}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/twitch-accounts' })}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Accounts
        </Button>

        {/* Account Details */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{account.username}</CardTitle>
                <div className="flex gap-2 mt-2">
                  <Badge variant={isPartner ? 'default' : 'secondary'}>
                    {isPartner ? 'Partner' : 'Affiliate'}
                  </Badge>
                  <Badge
                    variant={
                      account.status === 'approved'
                        ? 'default'
                        : account.status === 'pending'
                        ? 'secondary'
                        : 'destructive'
                    }
                  >
                    {account.status.charAt(0).toUpperCase() + account.status.slice(1)}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                {isAffiliate && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <Button
                            variant="default"
                            size="sm"
                            className="gap-2"
                            onClick={() => handleUpgrade(Variant_affiliate_partner.partner)}
                            disabled={!canUpgrade || upgradeMutation.isPending}
                          >
                            <Award className="h-4 w-4" />
                            Upgrade to Partner
                          </Button>
                        </div>
                      </TooltipTrigger>
                      {!canUpgrade && (
                        <TooltipContent>
                          <p>Active subscription required</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                )}
                {isPartner && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => handleUpgrade(Variant_affiliate_partner.affiliate)}
                            disabled={!canUpgrade || upgradeMutation.isPending}
                          >
                            <TrendingUp className="h-4 w-4" />
                            Change to Affiliate
                          </Button>
                        </div>
                      </TooltipTrigger>
                      {!canUpgrade && (
                        <TooltipContent>
                          <p>Active subscription required</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Revenue Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card className="border-l-4 border-l-primary">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  {revenuesLoading ? (
                    <Skeleton className="h-8 w-24 mt-1" />
                  ) : (
                    <p className="text-3xl font-bold text-foreground">${totalRevenue.toFixed(2)}</p>
                  )}
                </div>
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[oklch(0.55_0.12_120)]">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Entries</p>
                  {revenuesLoading ? (
                    <Skeleton className="h-8 w-16 mt-1" />
                  ) : (
                    <p className="text-3xl font-bold text-foreground">{accountRevenues.length}</p>
                  )}
                </div>
                <TrendingUp className="h-8 w-8 text-[oklch(0.55_0.12_120)]" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue History</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart revenues={accountRevenues} isLoading={revenuesLoading} />
          </CardContent>
        </Card>
      </div>
    </SubscriptionGuard>
  );
}
