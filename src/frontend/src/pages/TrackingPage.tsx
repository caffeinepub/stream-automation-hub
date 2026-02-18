import { useGetAllRevenueEntries, useGetAllTwitchAccounts } from '../hooks/useQueries';
import SubscriptionGuard from '../components/SubscriptionGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { TrendingUp, DollarSign, Activity } from 'lucide-react';
import RevenueChart from '../components/RevenueChart';

export default function TrackingPage() {
  const { data: revenues = [], isLoading: revenuesLoading } = useGetAllRevenueEntries();
  const { data: accounts = [], isLoading: accountsLoading } = useGetAllTwitchAccounts();

  const isLoading = revenuesLoading || accountsLoading;

  const totalRevenue = revenues.reduce((sum, entry) => sum + entry.amount, 0);
  const revenueThisMonth = revenues
    .filter((entry) => {
      const entryDate = new Date(Number(entry.timestamp) / 1000000);
      const now = new Date();
      return entryDate.getMonth() === now.getMonth() && entryDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, entry) => sum + entry.amount, 0);

  return (
    <SubscriptionGuard>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Revenue Tracking</h1>
          <p className="text-muted-foreground">
            Monitor your revenue streams, track finances, and manage donations all in one place.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-3 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">All time earnings</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">This Month</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${revenueThisMonth.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">Current month revenue</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Accounts</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{accounts.length}</div>
                  <p className="text-xs text-muted-foreground">Twitch accounts tracked</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="revenue" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="revenue">Revenue Tracking</TabsTrigger>
                <TabsTrigger value="finance">Finance Tracker</TabsTrigger>
                <TabsTrigger value="donations">Donation Manager</TabsTrigger>
              </TabsList>

              <TabsContent value="revenue" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue History</CardTitle>
                    <CardDescription>
                      View all revenue entries across your Twitch accounts
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RevenueChart revenues={revenues} isLoading={false} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="finance" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Finance Tracker</CardTitle>
                    <CardDescription>
                      Track your income and expenses
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12 text-muted-foreground">
                      <p>Finance tracking features coming soon.</p>
                      <p className="text-sm mt-2">Track expenses, set budgets, and analyze your financial health.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="donations" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Donation Manager</CardTitle>
                    <CardDescription>
                      Manage and track donations from your community
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12 text-muted-foreground">
                      <p>Donation management features coming soon.</p>
                      <p className="text-sm mt-2">Track donations, send thank you messages, and analyze donor trends.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </SubscriptionGuard>
  );
}
