import { useState } from 'react';
import { useGetAllTwitchAccounts, useGetAllRevenueEntries } from '../hooks/useQueries';
import TwitchAccountList from '../components/TwitchAccountList';
import TwitchAccountForm from '../components/TwitchAccountForm';
import RevenueEntryForm from '../components/RevenueEntryForm';
import SubscriptionStatusCard from '../components/SubscriptionStatusCard';
import SubscriptionGuard from '../components/SubscriptionGuard';
import { Button } from '@/components/ui/button';
import { Plus, DollarSign, Users, TrendingUp } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function TwitchAccountsPage() {
  const { data: accounts = [], isLoading: accountsLoading } = useGetAllTwitchAccounts();
  const { data: revenues = [], isLoading: revenuesLoading } = useGetAllRevenueEntries();
  const [isAccountFormOpen, setIsAccountFormOpen] = useState(false);
  const [isRevenueFormOpen, setIsRevenueFormOpen] = useState(false);

  const affiliateAccounts = accounts.filter((acc) => acc.accountType === 'affiliate');
  const partnerAccounts = accounts.filter((acc) => acc.accountType === 'partner');

  const totalRevenue = revenues.reduce((sum, entry) => sum + entry.amount, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Banner */}
      <div className="relative mb-8 rounded-2xl overflow-hidden shadow-lg">
        <img
          src="/assets/generated/hero-banner.dim_1200x400.png"
          alt="Twitch Accounts Dashboard"
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
          <div className="px-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Twitch Accounts & Revenue
            </h1>
            <p className="text-white/90 text-lg">Manage your affiliate and partner accounts</p>
          </div>
        </div>
      </div>

      {/* Subscription Status */}
      <div className="mb-8">
        <SubscriptionStatusCard />
      </div>

      <SubscriptionGuard>
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-l-4 border-l-[oklch(0.65_0.15_25)]">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Accounts</p>
                  {accountsLoading ? (
                    <Skeleton className="h-8 w-16 mt-1" />
                  ) : (
                    <p className="text-3xl font-bold text-foreground">{accounts.length}</p>
                  )}
                </div>
                <Users className="h-8 w-8 text-[oklch(0.65_0.15_25)]" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[oklch(0.55_0.12_120)]">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Affiliates</p>
                  {accountsLoading ? (
                    <Skeleton className="h-8 w-16 mt-1" />
                  ) : (
                    <p className="text-3xl font-bold text-foreground">{affiliateAccounts.length}</p>
                  )}
                </div>
                <TrendingUp className="h-8 w-8 text-[oklch(0.55_0.12_120)]" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-accent">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Partners</p>
                  {accountsLoading ? (
                    <Skeleton className="h-8 w-16 mt-1" />
                  ) : (
                    <p className="text-3xl font-bold text-foreground">{partnerAccounts.length}</p>
                  )}
                </div>
                <TrendingUp className="h-8 w-8 text-accent-foreground" />
              </div>
            </CardContent>
          </Card>

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
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Your Accounts</h2>
          <div className="flex gap-2">
            <Dialog open={isRevenueFormOpen} onOpenChange={setIsRevenueFormOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <DollarSign className="h-4 w-4" />
                  Add Revenue
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Revenue Entry</DialogTitle>
                </DialogHeader>
                <RevenueEntryForm onSuccess={() => setIsRevenueFormOpen(false)} />
              </DialogContent>
            </Dialog>

            <Dialog open={isAccountFormOpen} onOpenChange={setIsAccountFormOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Account
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Twitch Account</DialogTitle>
                </DialogHeader>
                <TwitchAccountForm onSuccess={() => setIsAccountFormOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Accounts List with Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="all">All ({accounts.length})</TabsTrigger>
            <TabsTrigger value="affiliate">Affiliates ({affiliateAccounts.length})</TabsTrigger>
            <TabsTrigger value="partner">Partners ({partnerAccounts.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-6">
            <TwitchAccountList accounts={accounts} revenues={revenues} isLoading={accountsLoading} />
          </TabsContent>
          <TabsContent value="affiliate" className="mt-6">
            <TwitchAccountList accounts={affiliateAccounts} revenues={revenues} isLoading={accountsLoading} />
          </TabsContent>
          <TabsContent value="partner" className="mt-6">
            <TwitchAccountList accounts={partnerAccounts} revenues={revenues} isLoading={accountsLoading} />
          </TabsContent>
        </Tabs>
      </SubscriptionGuard>
    </div>
  );
}
