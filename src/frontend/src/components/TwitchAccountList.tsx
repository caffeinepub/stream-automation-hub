import type { TwitchAccount, RevenueEntry } from '../backend';
import TwitchAccountCard from './TwitchAccountCard';
import { Card, CardContent } from './ui/card';
import { Inbox } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

interface TwitchAccountListProps {
  accounts: TwitchAccount[];
  revenues: RevenueEntry[];
  isLoading: boolean;
}

export default function TwitchAccountList({ accounts, revenues, isLoading }: TwitchAccountListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-4" />
              <Skeleton className="h-9 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Inbox className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No accounts yet</h3>
          <p className="text-sm text-muted-foreground text-center max-w-sm">
            Add your first Twitch account to start tracking your passive income
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {accounts.map((account) => (
        <TwitchAccountCard key={account.id.toString()} account={account} revenues={revenues} />
      ))}
    </div>
  );
}
